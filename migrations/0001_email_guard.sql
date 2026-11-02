-- Abuse limits for the newsletter form (src/lib/server/d1-store.ts).
-- Keys are SHA-256 hashes; no email address or IP is ever stored.

-- One row per send attempt, for the per-IP hourly limit.
CREATE TABLE ip_hits (
  key TEXT NOT NULL,
  at INTEGER NOT NULL -- ms since epoch
);
CREATE INDEX ip_hits_key_at ON ip_hits (key, at);
CREATE INDEX ip_hits_at ON ip_hits (at);

-- One row per address that was emailed, until the cooldown ends.
CREATE TABLE email_claims (
  key TEXT PRIMARY KEY,
  expires_at INTEGER NOT NULL -- ms since epoch
);
