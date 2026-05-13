-- Add pricing_md + resources_md columns for richer detail pages.
-- Both nullable so existing rows aren't affected until populated.

ALTER TABLE tools ADD COLUMN IF NOT EXISTS pricing_md   TEXT;
ALTER TABLE tools ADD COLUMN IF NOT EXISTS resources_md TEXT;
