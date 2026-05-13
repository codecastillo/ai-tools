CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS tools (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  title         TEXT NOT NULL,
  url           TEXT NOT NULL,
  tagline       TEXT,
  description   TEXT,
  category      TEXT CHECK (category IS NULL OR category IN ('claude','clis','frameworks','productivity')),
  tags          TEXT[] NOT NULL DEFAULT '{}',
  install_md    TEXT,
  usage_md      TEXT,
  cheatsheet_md TEXT,
  asciinema_id  TEXT,
  pricing       TEXT CHECK (pricing IS NULL OR pricing IN ('free','paid','freemium','oss')),
  difficulty    TEXT CHECK (difficulty IS NULL OR difficulty IN ('easy','medium','hard')),
  time_to_value TEXT,
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  submitter     TEXT,
  is_curated    BOOLEAN NOT NULL DEFAULT FALSE,
  last_verified TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_at   TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS tools_status_idx ON tools(status);
CREATE INDEX IF NOT EXISTS tools_category_idx ON tools(category);
CREATE INDEX IF NOT EXISTS tools_created_at_idx ON tools(created_at DESC);

CREATE TABLE IF NOT EXISTS stacks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT,
  description TEXT,
  tool_ids    UUID[] NOT NULL,
  is_curated  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS stacks_is_curated_idx ON stacks(is_curated);
