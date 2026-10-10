CREATE TABLE IF NOT EXISTS ports (
  world_id TEXT NOT NULL,
  port_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  city_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  berth_capacity INTEGER NOT NULL,
  passenger_terminal INTEGER NOT NULL DEFAULT 1,
  cargo_terminal INTEGER NOT NULL DEFAULT 1,
  open INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (world_id, port_id)
);

CREATE TABLE IF NOT EXISTS vessels (
  world_id TEXT NOT NULL,
  vessel_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  vessel_type TEXT NOT NULL,
  passenger_capacity INTEGER NOT NULL DEFAULT 0,
  cargo_capacity_kg REAL NOT NULL DEFAULT 0,
  fuel_level REAL NOT NULL DEFAULT 1,
  condition REAL NOT NULL DEFAULT 1,
  home_port_id TEXT NOT NULL,
  in_service INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (world_id, vessel_id)
);

CREATE TABLE IF NOT EXISTS maritime_routes (
  world_id TEXT NOT NULL,
  route_id TEXT NOT NULL,
  origin_port_id TEXT NOT NULL,
  destination_port_id TEXT NOT NULL,
  distance_kilometers REAL NOT NULL,
  passenger_allowed INTEGER NOT NULL DEFAULT 1,
  cargo_allowed INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (world_id, route_id)
);

CREATE TABLE IF NOT EXISTS maritime_voyages (
  world_id TEXT NOT NULL,
  voyage_id TEXT NOT NULL,
  route_id TEXT NOT NULL,
  vessel_id TEXT NOT NULL,
  status TEXT NOT NULL,
  scheduled_departure TEXT NOT NULL,
  scheduled_arrival TEXT NOT NULL,
  weather_state_id TEXT,
  PRIMARY KEY (world_id, voyage_id)
);

CREATE TABLE IF NOT EXISTS maritime_crew_assignments (
  world_id TEXT NOT NULL,
  assignment_id TEXT NOT NULL,
  voyage_id TEXT NOT NULL,
  person_entity_id TEXT NOT NULL,
  role TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (world_id, assignment_id)
);

CREATE TABLE IF NOT EXISTS vessel_maintenance (
  world_id TEXT NOT NULL,
  maintenance_id TEXT NOT NULL,
  vessel_id TEXT NOT NULL,
  maintenance_tag TEXT NOT NULL,
  status TEXT NOT NULL,
  scheduled_at TEXT NOT NULL,
  completed_at TEXT,
  PRIMARY KEY (world_id, maintenance_id)
);

CREATE TABLE IF NOT EXISTS maritime_weather_state (
  world_id TEXT NOT NULL,
  weather_state_id TEXT NOT NULL,
  route_id TEXT NOT NULL,
  condition_tag TEXT NOT NULL,
  disruption_level REAL NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (world_id, weather_state_id)
);

CREATE TABLE IF NOT EXISTS maritime_cargo (
  world_id TEXT NOT NULL,
  cargo_id TEXT NOT NULL,
  voyage_id TEXT NOT NULL,
  category_tag TEXT NOT NULL,
  weight_kilograms REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  PRIMARY KEY (world_id, cargo_id)
);

CREATE TABLE IF NOT EXISTS port_fees (
  world_id TEXT NOT NULL,
  fee_id TEXT NOT NULL,
  port_id TEXT NOT NULL,
  voyage_id TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  amount_minor_units INTEGER NOT NULL DEFAULT 0,
  fee_type TEXT NOT NULL,
  paid INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (world_id, fee_id)
);

CREATE TABLE IF NOT EXISTS maritime_trade_records (
  world_id TEXT NOT NULL,
  trade_record_id TEXT NOT NULL,
  voyage_id TEXT NOT NULL,
  origin_country_id TEXT NOT NULL,
  destination_country_id TEXT NOT NULL,
  cargo_category TEXT NOT NULL,
  cargo_weight_kilograms REAL NOT NULL DEFAULT 0,
  recorded_at TEXT NOT NULL,
  PRIMARY KEY (world_id, trade_record_id)
);
