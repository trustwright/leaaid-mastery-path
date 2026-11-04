import { env } from 'cloudflare:workers';
import { credentialReceiptsSchema, credentialTierIndexSchema } from '../../../db/schema';

export const runtime = 'edge';

type CredentialRequest = { score?: number; rounds?: number; decisions?: number; tier?: string; displayName?: string; validateToken?: string };
type CredentialClaim = { v:1; id:string; tier:string; score:number; rounds:number; decisions:number; issuedAt:string; issuer:'Digital Trust Proficiency'|'Identity Proving Ground'; displayName?:string };
type CredentialEnv = { CREDENTIAL_SIGNING_SECRET?: string; DB?: D1Database };

const encoder=new TextEncoder();
const json=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const base64url=(bytes:Uint8Array)=>{let value='';for(const byte of bytes)value+=String.fromCharCode(byte);return btoa(value).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'')};
const decode=(value:string)=>{const padded=value.replaceAll('-','+').replaceAll('_','/')+'='.repeat((4-value.length%4)%4);return Uint8Array.from(atob(padded),char=>char.charCodeAt(0))};
const tierFor=(score:number)=>score===100?'Premier Knowledge':score>=90?'Gold Knowledge':score>=80?'Silver Knowledge':score>=70?'Bronze Knowledge':null;
const tierThreshold:Record<string,number>={'Bronze Knowledge':70,'Silver Knowledge':80,'Gold Knowledge':90,'Premier Knowledge':100};
const secret=()=>(env as unknown as CredentialEnv).CREDENTIAL_SIGNING_SECRET;
const normalizeDisplayName=(value:unknown)=>{if(typeof value!=='string')return '';return value.normalize('NFKC').replace(/[^\p{L}\p{M}\p{N} .,'’\-]/gu,'').replace(/\s+/g,' ').trim().slice(0,64)};

async function signingKey(){const value=secret();if(!value)throw new Error('missing signing key');return crypto.subtle.importKey('raw',encoder.encode(value),{name:'HMAC',hash:'SHA-256'},false,['sign','verify'])}
async function fingerprint(token:string){const digest=new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(token)));return Array.from(digest.slice(0,8),byte=>byte.toString(16).padStart(2,'0')).join('').toUpperCase().match(/.{1,4}/g)?.join('-')}
async function recordIssuance(claim:CredentialClaim){const db=(env as unknown as CredentialEnv).DB;if(!db)return;await db.batch([db.prepare(credentialReceiptsSchema),db.prepare(credentialTierIndexSchema)]);await db.prepare(`INSERT OR IGNORE INTO credential_receipts (claim_id,tier,issued_at) VALUES (?,?,?)`).bind(claim.id,claim.tier,claim.issuedAt).run()}
async function validateCredential(token:string){
  const [payload,signature,...rest]=token.split('.');
  if(!payload||!signature||rest.length||token.length>4096)return json({valid:false},400);
  const valid=await crypto.subtle.verify('HMAC',await signingKey(),decode(signature),encoder.encode(payload));
  if(!valid)return json({valid:false},400);
  const claim=JSON.parse(new TextDecoder().decode(decode(payload))) as CredentialClaim;
  const validName=!claim.displayName||(claim.displayName.length>=2&&claim.displayName.length<=64&&normalizeDisplayName(claim.displayName)===claim.displayName);
  if(claim.v!==1||!['Digital Trust Proficiency','Identity Proving Ground'].includes(claim.issuer)||!tierThreshold[claim.tier]||claim.score<tierThreshold[claim.tier]||claim.rounds<1||claim.decisions<25||!validName)return json({valid:false},400);
  return json({valid:true,fingerprint:await fingerprint(token),claim});
}

export async function POST(request:Request){
  try{
    const body=await request.json() as CredentialRequest;
    if(typeof body.validateToken==='string')return validateCredential(body.validateToken);
    const score=Number(body.score),rounds=Number(body.rounds),decisions=Number(body.decisions);
    if(!Number.isInteger(score)||score<70||score>100||!Number.isInteger(rounds)||rounds<1||!Number.isInteger(decisions)||decisions<25)return json({error:'Complete one round and reach Bronze or higher before creating a credential.'},400);
    const tier=body.tier||tierFor(score);if(!tier||!tierThreshold[tier]||score<tierThreshold[tier])return json({error:'That achievement tier has not been reached.'},400);
    const displayName=normalizeDisplayName(body.displayName);if(body.displayName&&displayName.length<2)return json({error:'Enter at least two valid characters for the badge name.'},400);
    const claim:CredentialClaim={v:1,id:crypto.randomUUID(),tier,score,rounds,decisions,issuedAt:new Date().toISOString(),issuer:'Digital Trust Proficiency',...(displayName?{displayName}:{})};
    const payload=base64url(encoder.encode(JSON.stringify(claim)));
    const signature=base64url(new Uint8Array(await crypto.subtle.sign('HMAC',await signingKey(),encoder.encode(payload))));
    const token=`${payload}.${signature}`;
    try{await recordIssuance(claim)}catch{}
    return json({token,fingerprint:await fingerprint(token),claim});
  }catch{return json({error:'Credential signing is temporarily unavailable.'},503)}
}

export async function GET(request:Request){
  try{
    const token=new URL(request.url).searchParams.get('token')||'';
    return validateCredential(token);
  }catch{return json({valid:false},400)}
}
