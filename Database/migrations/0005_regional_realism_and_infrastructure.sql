CREATE TABLE IF NOT EXISTS country_runtime_profiles (
  world_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  profile_json TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (world_id, country_id)
);

CREATE TABLE IF NOT EXISTS regional_power_state (
  world_id TEXT NOT NULL,
  region_id TEXT NOT NULL,
  available_generation_mw REAL NOT NULL DEFAULT 0,
  demand_mw REAL NOT NULL DEFAULT 0,
  distribution_condition REAL NOT NULL DEFAULT 1,
  load_shedding INTEGER NOT NULL DEFAULT 0,
  major_fault INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (world_id, region_id)
);

CREATE TABLE IF NOT EXISTS regional_telecom_state (
  world_id TEXT NOT NULL,
  region_id TEXT NOT NULL,
  coverage_tier INTEGER NOT NULL DEFAULT 3,
  congestion REAL NOT NULL DEFAULT 0,
  grid_availability REAL NOT NULL DEFAULT 1,
  backup_energy REAL NOT NULL DEFAULT 1,
  fiber_backhaul INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (world_id, region_id)
);

CREATE TABLE IF NOT EXISTS road_segment_state (
  world_id TEXT NOT NULL,
  road_segment_id TEXT NOT NULL,
  region_id TEXT NOT NULL,
  condition INTEGER NOT NULL DEFAULT 1,
  congestion REAL NOT NULL DEFAULT 0,
  drainage_functional INTEGER NOT NULL DEFAULT 1,
  incident_active INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (world_id, road_segment_id)
);
