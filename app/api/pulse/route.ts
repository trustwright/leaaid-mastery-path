import { env } from 'cloudflare:workers';
import { activityBucketsIndexSchema, activityBucketsSchema, credentialReceiptsSchema, credentialTierIndexSchema, dailyPulseSchema, dayIndexSchema, leaderboardIndexSchema, leaderboardSchema, roundAggregatesSchema } from '../../../db/schema';
import { SCALE_BENCHMARK } from '../../../lib/scaleBenchmark';

export const runtime = 'edge';

type DomainPayload = { domain: number; answered: number; correct: number };
type RoundPayload = { eventId?: string; answered: number; correct: number; durationMs: number; fluency?: number; domains: DomainPayload[] };
type ActivityPayload = { activity:true; mode:string; domain:number };
type DbEnv = { DB?: D1Database };
let databaseReady: Promise<D1Database> | undefined;

const json = (body: unknown, status = 200) => Response.json(body, {
  status,
  headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
});

async function database() {
  if (databaseReady) return databaseReady;
  const db = (env as unknown as DbEnv).DB;
  if (!db) throw new Error('Community pulse storage is not configured.');
  databaseReady = (async () => {
    await db.batch([
      db.prepare(roundAggregatesSchema),
      db.prepare(dailyPulseSchema),
      db.prepare(dayIndexSchema),
      db.prepare(leaderboardSchema),
      db.prepare(leaderboardIndexSchema),
      db.prepare(credentialReceiptsSchema),
      db.prepare(credentialTierIndexSchema),
      db.prepare(activityBucketsSchema),
      db.prepare(activityBucketsIndexSchema),
    ]);
    return db;
  })().catch(error => {
    databaseReady = undefined;
    throw error;
  });
  return databaseReady;
}

function validPayload(value: unknown): value is RoundPayload {
  if (!value || typeof value !== 'object') return false;
  const item = value as RoundPayload;
  return (item.eventId === undefined || /^[0-9a-f-]{36}$/i.test(item.eventId))
    && Number.isInteger(item.answered) && item.answered === 25
    && Number.isFinite(item.correct) && Number.isInteger(item.correct*2) && item.correct >= 0 && item.correct <= 25
    && Number.isFinite(item.durationMs) && item.durationMs >= 5000 && item.durationMs <= 7_200_000
    && (item.fluency === undefined || (Number.isInteger(item.fluency) && item.fluency >= 0 && item.fluency <= 100))
    && Array.isArray(item.domains) && item.domains.length === 5
    && item.domains.every(domain => Number.isInteger(domain.domain) && domain.domain >= 1 && domain.domain <= 5
      && Number.isInteger(domain.answered) && domain.answered >= 0 && domain.answered <= 25
      && Number.isFinite(domain.correct) && Number.isInteger(domain.correct*2) && domain.correct >= 0 && domain.correct <= domain.answered);
}

function validActivity(value:unknown):value is ActivityPayload {
  if(!value||typeof value!=='object')return false;
  const item=value as ActivityPayload;
  return item.activity===true&&['home','training','terminology','analysis'].includes(item.mode)&&Number.isInteger(item.domain)&&item.domain>=0&&item.domain<=5;
}

export async function POST(request: Request) {
  try {
    const payload: unknown = await request.json();
    if(validActivity(payload)){
      const db=await database();
      const minute=new Date().toISOString().slice(0,16);
      await db.batch([
        db.prepare(`INSERT INTO activity_buckets (minute,mode,domain,signals) VALUES (?,?,?,1) ON CONFLICT(minute,mode,domain) DO UPDATE SET signals=signals+1`).bind(minute,payload.mode,payload.domain),
        db.prepare(`DELETE FROM activity_buckets WHERE minute < strftime('%Y-%m-%dT%H:%M','now','-2 days')`),
      ]);
      return json({accepted:true});
    }
    if (!validPayload(payload)) return json({ error: 'Invalid aggregate round payload.' }, 400);
    const db = await database();
    const day = new Date().toISOString().slice(0, 10);
    const pct = payload.correct / payload.answered;
    const bucket = pct === 1 ? 'premier' : pct >= .9 ? 'gold' : pct >= .8 ? 'silver' : pct >= .7 ? 'bronze' : 'developing';
    const roundId=payload.eventId||crypto.randomUUID();
    if(payload.eventId){
      const prior=await db.prepare(`SELECT id FROM round_leaderboard WHERE id=? LIMIT 1`).bind(roundId).first();
      if(prior)return json({accepted:true,duplicate:true});
    }
    const alias=`Learner ${roundId.replaceAll('-','').slice(0,6).toUpperCase()}`;
    const strongestDomain=[...payload.domains].sort((a,b)=>(b.answered?b.correct/b.answered:0)-(a.answered?a.correct/a.answered:0))[0]?.domain||1;
    const fluency=payload.fluency??Math.round(pct*75+Math.max(0,25-Math.max(0,payload.durationMs-420000)/36000));
    const statements = payload.domains.map(domain => db.prepare(`
      INSERT INTO round_aggregates (day, domain, rounds, answered, correct, duration_ms)
      VALUES (?, ?, 1, ?, ?, ?)
      ON CONFLICT(day, domain) DO UPDATE SET
        rounds = rounds + 1,
        answered = answered + excluded.answered,
        correct = correct + excluded.correct,
        duration_ms = duration_ms + excluded.duration_ms
    `).bind(day, domain.domain, domain.answered, domain.correct, Math.round(payload.durationMs * (domain.answered / 25))));
    statements.push(db.prepare(`
      INSERT INTO daily_pulse (day, rounds, perfect_rounds, developing, bronze, silver, gold, premier, duration_ms)
      VALUES (?, 1, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(day) DO UPDATE SET
        rounds = rounds + 1,
        perfect_rounds = perfect_rounds + excluded.perfect_rounds,
        developing = developing + excluded.developing,
        bronze = bronze + excluded.bronze,
        silver = silver + excluded.silver,
        gold = gold + excluded.gold,
        premier = premier + excluded.premier,
        duration_ms = duration_ms + excluded.duration_ms
    `).bind(day, payload.correct === 25 ? 1 : 0, bucket === 'developing' ? 1 : 0, bucket === 'bronze' ? 1 : 0, bucket === 'silver' ? 1 : 0, bucket === 'gold' ? 1 : 0, bucket === 'premier' ? 1 : 0, Math.round(payload.durationMs)));
    statements.push(db.prepare(`
      INSERT INTO round_leaderboard (id, alias, score, fluency, duration_ms, strongest_domain, tier)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(roundId,alias,payload.correct,fluency,Math.round(payload.durationMs),strongestDomain,bucket));
    statements.push(db.prepare(`DELETE FROM round_leaderboard WHERE created_at < datetime('now','-90 days')`));
    await db.batch(statements);
    return json({ accepted: true });
  } catch {
    return json({ error: 'Community pulse is temporarily unavailable.' }, 503);
  }
}

export async function GET() {
  try {
    const db = await database();
    const [daily, domains, leaderboard, badges, lifetime, activityModes, activityDomains] = await db.batch([
      db.prepare(`SELECT day, rounds, perfect_rounds, developing, bronze, silver, gold, premier,
        CASE WHEN rounds > 0 THEN duration_ms / rounds ELSE 0 END AS avg_duration_ms
        FROM daily_pulse WHERE day >= date('now', '-6 days') ORDER BY day ASC`),
      db.prepare(`SELECT domain, SUM(rounds) AS rounds, SUM(answered) AS answered, SUM(correct) AS correct,
        CASE WHEN SUM(rounds) > 0 THEN SUM(duration_ms) / SUM(rounds) ELSE 0 END AS avg_duration_ms
        FROM round_aggregates WHERE day >= date('now', '-6 days') GROUP BY domain ORDER BY domain ASC`),
      db.prepare(`SELECT alias, score, score * 4 AS accuracy, fluency, duration_ms, strongest_domain, tier, created_at
        FROM round_leaderboard WHERE created_at >= datetime('now','-7 days')
        ORDER BY score DESC, fluency DESC, duration_ms ASC, created_at ASC LIMIT 10`),
      db.prepare(`SELECT tier, COUNT(*) AS issued FROM credential_receipts GROUP BY tier ORDER BY issued DESC`),
      db.prepare(`SELECT COALESCE(SUM(rounds),0) AS rounds, COALESCE(SUM(perfect_rounds),0) AS perfect_rounds,
        COALESCE(SUM(developing+bronze+silver+gold+premier),0) AS completion_events
        FROM daily_pulse`),
      db.prepare(`SELECT mode,SUM(signals) AS signals FROM activity_buckets WHERE minute >= strftime('%Y-%m-%dT%H:%M','now','-2 minutes') GROUP BY mode`),
      db.prepare(`SELECT domain,SUM(signals) AS sessions FROM activity_buckets WHERE minute >= strftime('%Y-%m-%dT%H:%M','now','-2 minutes') AND domain > 0 GROUP BY domain ORDER BY domain`),
    ]);
    const modes=Object.fromEntries(activityModes.results.map(item=>[String(item.mode),Number(item.signals)]));
    const active={sessions:Object.values(modes).reduce((sum,value)=>sum+Number(value),0),training:modes.training||0,terminology:modes.terminology||0,analyzing:modes.analysis||0};
    return json({ daily: daily.results, domains: domains.results, leaderboard:leaderboard.results, badgeTotals:badges.results, lifetime:lifetime.results[0]||{rounds:0,perfect_rounds:0,completion_events:0}, benchmark:SCALE_BENCHMARK, active, activeDomains:activityDomains.results, privacy: 'aggregate-activity-no-personal-data' });
  } catch {
    return json({ daily: [], domains: [], leaderboard:[], badgeTotals:[], lifetime:{rounds:0,perfect_rounds:0,completion_events:0}, benchmark:SCALE_BENCHMARK, active: {sessions:0,training:0,terminology:0,analyzing:0}, activeDomains: [], privacy: 'local-preview' });
  }
}
