CREATE TABLE IF NOT EXISTS save_slots (
  save_id TEXT PRIMARY KEY,
  world_id TEXT NOT NULL,
  player_character_id TEXT NOT NULL,
  schema_version INTEGER NOT NULL,
  active_district_id TEXT,
  saved_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS district_simulation_state (
  world_id TEXT NOT NULL,
  district_id TEXT NOT NULL,
  simulation_tier INTEGER NOT NULL,
  state_json TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (world_id, district_id)
);

CREATE INDEX IF NOT EXISTS idx_save_slots_world ON save_slots(world_id);
