CREATE TABLE IF NOT EXISTS city_runtime_profiles (
  world_id TEXT NOT NULL,
  city_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  profile_json TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (world_id, city_id)
);

CREATE TABLE IF NOT EXISTS public_transit_routes (
  world_id TEXT NOT NULL,
  route_id TEXT NOT NULL,
  operator_id TEXT,
  origin_stop_id TEXT NOT NULL,
  destination_stop_id TEXT NOT NULL,
  transit_type TEXT NOT NULL,
  headway_minutes INTEGER NOT NULL DEFAULT 15,
  fare_minor_units INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (world_id, route_id)
);

CREATE TABLE IF NOT EXISTS public_transit_timetable (
  world_id TEXT NOT NULL,
  route_id TEXT NOT NULL,
  stop_id TEXT NOT NULL,
  minute_of_day INTEGER NOT NULL,
  expected_dwell_seconds INTEGER NOT NULL DEFAULT 30,
  PRIMARY KEY (world_id, route_id, stop_id, minute_of_day)
);

CREATE TABLE IF NOT EXISTS neighborhood_runtime_snapshots (
  world_id TEXT NOT NULL,
  neighborhood_id TEXT NOT NULL,
  snapshot_json TEXT NOT NULL DEFAULT '{}',
  world_unix_seconds INTEGER NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (world_id, neighborhood_id)
);
