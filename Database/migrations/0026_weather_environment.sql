CREATE TABLE IF NOT EXISTS regional_weather_state (
  world_id TEXT NOT NULL,
  weather_state_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  region_id TEXT NOT NULL,
  primary_condition TEXT NOT NULL,
  season TEXT NOT NULL,
  rain_intensity REAL NOT NULL DEFAULT 0,
  storm_intensity REAL NOT NULL DEFAULT 0,
  heat_intensity REAL NOT NULL DEFAULT 0,
  fog_intensity REAL NOT NULL DEFAULT 0,
  flooding_intensity REAL NOT NULL DEFAULT 0,
  wind_intensity REAL NOT NULL DEFAULT 0,
  wet_roads REAL NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (world_id, weather_state_id),
  UNIQUE(world_id, country_id, region_id)
);

CREATE TABLE IF NOT EXISTS environment_impact_state (
  world_id TEXT NOT NULL,
  weather_state_id TEXT NOT NULL,
  region_id TEXT NOT NULL,
  solar_output_multiplier REAL NOT NULL DEFAULT 1,
  flight_disruption REAL NOT NULL DEFAULT 0,
  ship_disruption REAL NOT NULL DEFAULT 0,
  power_grid_damage_risk REAL NOT NULL DEFAULT 0,
  agricultural_yield_multiplier REAL NOT NULL DEFAULT 1,
  road_grip_multiplier REAL NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (world_id, weather_state_id)
);

CREATE TABLE IF NOT EXISTS weather_events (
  world_id TEXT NOT NULL,
  event_id TEXT NOT NULL,
  weather_state_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  region_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  severity REAL NOT NULL,
  status TEXT NOT NULL,
  started_at TEXT NOT NULL,
  ended_at TEXT,
  PRIMARY KEY (world_id, event_id)
);
