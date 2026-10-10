-- Phase 40: fictional, opt-in, non-graphic folklore stories.
-- Future persistence model; not wired to the local in-memory service.
CREATE TABLE IF NOT EXISTS folklore_preferences (
  world_id TEXT NOT NULL,
  character_id TEXT NOT NULL,
  mode TEXT NOT NULL DEFAULT 'off' CHECK (mode IN ('off','ambiguous','supernatural')),
  content_warnings_enabled INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL,
  PRIMARY KEY(world_id, character_id)
);
CREATE TABLE IF NOT EXISTS folklore_stories (
  world_id TEXT NOT NULL,
  story_id TEXT NOT NULL,
  character_id TEXT NOT NULL,
  country_id TEXT NOT NULL CHECK (country_id IN ('Nigeria','Ghana')),
  region_id TEXT NOT NULL,
  property_id TEXT NOT NULL,
  theme TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('ambiguous','supernatural')),
  status TEXT NOT NULL CHECK (status IN ('active','resolved','paused-opt-out')),
  stage TEXT NOT NULL,
  outcome_tag TEXT,
  property_reputation_01 REAL NOT NULL CHECK (property_reputation_01 BETWEEN 0 AND 1),
  household_uncertainty_01 REAL NOT NULL CHECK (household_uncertainty_01 BETWEEN 0 AND 1),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY(world_id,story_id)
);
CREATE TABLE IF NOT EXISTS folklore_decisions (
  world_id TEXT NOT NULL,
  story_id TEXT NOT NULL,
  decision_id TEXT NOT NULL,
  choice TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY(world_id,story_id,decision_id)
);
CREATE INDEX IF NOT EXISTS idx_folklore_journal
ON folklore_stories(world_id,character_id,country_id,region_id,status);
