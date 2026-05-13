-- Round 5: tool DNA personality blob + newsletter subscription table.

ALTER TABLE tools ADD COLUMN IF NOT EXISTS tool_dna JSONB;

CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email        TEXT NOT NULL UNIQUE,
  source       TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_newsletter_created_at ON newsletter_subscriptions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tools_created_at      ON tools (created_at DESC);
