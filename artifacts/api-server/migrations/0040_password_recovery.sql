CREATE TABLE IF NOT EXISTS password_recovery_requests (
  user_id TEXT PRIMARY KEY NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  consumed_at INTEGER,
  claim_id TEXT
);

CREATE INDEX IF NOT EXISTS password_recovery_requests_expires_at_idx
  ON password_recovery_requests(expires_at);
