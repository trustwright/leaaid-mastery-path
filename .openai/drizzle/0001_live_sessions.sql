CREATE TABLE IF NOT EXISTS live_sessions (
  session_id TEXT PRIMARY KEY,
  last_seen INTEGER NOT NULL,
  domain INTEGER NOT NULL DEFAULT 0,
  mode TEXT NOT NULL DEFAULT 'home',
  progress INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_live_sessions_last_seen
ON live_sessions(last_seen);
