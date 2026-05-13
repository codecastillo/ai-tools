-- Replace every em dash (U+2014) in user-visible columns with a comma+space.
-- The em dash is forbidden site-wide per the brand guideline.
-- Commas are used because most existing em-dashes connect related clauses;
-- where this produces awkward grammar, future seed edits will fix it case-by-case.

UPDATE tools SET tagline       = REPLACE(tagline,       '—', ', ') WHERE tagline       LIKE '%—%';
UPDATE tools SET description   = REPLACE(description,   '—', ', ') WHERE description   LIKE '%—%';
UPDATE tools SET install_md    = REPLACE(install_md,    '—', ', ') WHERE install_md    LIKE '%—%';
UPDATE tools SET usage_md      = REPLACE(usage_md,      '—', ', ') WHERE usage_md      LIKE '%—%';
UPDATE tools SET cheatsheet_md = REPLACE(cheatsheet_md, '—', ', ') WHERE cheatsheet_md LIKE '%—%';

UPDATE stacks SET name        = REPLACE(name,        '—', ', ') WHERE name        LIKE '%—%';
UPDATE stacks SET description = REPLACE(description, '—', ', ') WHERE description LIKE '%—%';
