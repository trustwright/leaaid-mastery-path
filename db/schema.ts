export const roundAggregatesSchema = `
CREATE TABLE IF NOT EXISTS round_aggregates (
  day TEXT NOT NULL,
  domain INTEGER NOT NULL,
  rounds INTEGER NOT NULL DEFAULT 0,
  answered INTEGER NOT NULL DEFAULT 0,
  correct INTEGER NOT NULL DEFAULT 0,
  duration_ms INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, domain)
)`;

export const dailyPulseSchema = `
CREATE TABLE IF NOT EXISTS daily_pulse (
  day TEXT PRIMARY KEY,
  rounds INTEGER NOT NULL DEFAULT 0,
  perfect_rounds INTEGER NOT NULL DEFAULT 0,
  developing INTEGER NOT NULL DEFAULT 0,
  bronze INTEGER NOT NULL DEFAULT 0,
  silver INTEGER NOT NULL DEFAULT 0,
  gold INTEGER NOT NULL DEFAULT 0,
  premier INTEGER NOT NULL DEFAULT 0,
  duration_ms INTEGER NOT NULL DEFAULT 0
)`;

export const dayIndexSchema = `
CREATE INDEX IF NOT EXISTS idx_round_aggregates_day
ON round_aggregates(day)
`;

export const leaderboardSchema = `
CREATE TABLE IF NOT EXISTS round_leaderboard (
  id TEXT PRIMARY KEY,
  alias TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 25),
  fluency INTEGER NOT NULL CHECK (fluency >= 0 AND fluency <= 100),
  duration_ms INTEGER NOT NULL,
  strongest_domain INTEGER NOT NULL CHECK (strongest_domain >= 1 AND strongest_domain <= 5),
  tier TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)`;

export const leaderboardIndexSchema = `
CREATE INDEX IF NOT EXISTS idx_round_leaderboard_rank
ON round_leaderboard(created_at, score DESC, fluency DESC, duration_ms ASC)
`;

export const credentialReceiptsSchema = `
CREATE TABLE IF NOT EXISTS credential_receipts (
  claim_id TEXT PRIMARY KEY,
  tier TEXT NOT NULL CHECK (tier IN ('Bronze Knowledge','Silver Knowledge','Gold Knowledge','Premier Knowledge')),
  issued_at TEXT NOT NULL
)`;

export const credentialTierIndexSchema = `
CREATE INDEX IF NOT EXISTS idx_credential_receipts_tier
ON credential_receipts(tier)
`;

export const activityBucketsSchema = `
CREATE TABLE IF NOT EXISTS activity_buckets (
  minute TEXT NOT NULL,
  mode TEXT NOT NULL,
  domain INTEGER NOT NULL DEFAULT 0,
  signals INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (minute, mode, domain)
)`;

export const activityBucketsIndexSchema = `
CREATE INDEX IF NOT EXISTS idx_activity_buckets_minute
ON activity_buckets(minute)
`;
