CREATE TABLE IF NOT EXISTS round_leaderboard (
  id TEXT PRIMARY KEY,
  alias TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 25),
  fluency INTEGER NOT NULL CHECK (fluency >= 0 AND fluency <= 100),
  duration_ms INTEGER NOT NULL,
  strongest_domain INTEGER NOT NULL CHECK (strongest_domain >= 1 AND strongest_domain <= 5),
  tier TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_round_leaderboard_rank
ON round_leaderboard(created_at, score DESC, fluency DESC, duration_ms ASC);

CREATE TABLE IF NOT EXISTS credential_receipts (
  claim_id TEXT PRIMARY KEY,
  tier TEXT NOT NULL CHECK (tier IN ('Bronze Knowledge','Silver Knowledge','Gold Knowledge','Premier Knowledge')),
  issued_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_credential_receipts_tier
ON credential_receipts(tier);

CREATE TABLE IF NOT EXISTS activity_buckets (
  minute TEXT NOT NULL,
  mode TEXT NOT NULL,
  domain INTEGER NOT NULL DEFAULT 0,
  signals INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (minute, mode, domain)
);

CREATE INDEX IF NOT EXISTS idx_activity_buckets_minute
ON activity_buckets(minute);

PRAGMA optimize;
