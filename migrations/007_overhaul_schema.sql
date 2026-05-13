-- Round 4 overhaul: structured columns for interactive components.
-- pricing_tiers: JSONB array of { name, price, period, highlight, features[] }
-- strengths:     JSONB array of { axis, score 0..10 } (5 axes per tool)
-- workflows:     JSONB array of { title, prompt, steps[], outcome }
-- popularity:    INT 0..100 used by trending strip and sort

ALTER TABLE tools ADD COLUMN IF NOT EXISTS pricing_tiers JSONB;
ALTER TABLE tools ADD COLUMN IF NOT EXISTS strengths     JSONB;
ALTER TABLE tools ADD COLUMN IF NOT EXISTS workflows     JSONB;
ALTER TABLE tools ADD COLUMN IF NOT EXISTS popularity    INT NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_tools_popularity ON tools (popularity DESC);
