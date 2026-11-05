CREATE TABLE IF NOT EXISTS achievement_receipts (
  verification_code TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  learner_code TEXT NOT NULL,
  achievement_id TEXT NOT NULL,
  title TEXT NOT NULL,
  module_id INTEGER,
  issued_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  harness_version TEXT NOT NULL,
  curriculum_version TEXT NOT NULL,
  evidence_json TEXT NOT NULL,
  revoked_at TEXT,
  UNIQUE (session_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_achievement_receipts_learner
ON achievement_receipts(learner_code, issued_at);

PRAGMA optimize;
