CREATE TABLE IF NOT EXISTS airports (
  world_id TEXT NOT NULL,
  airport_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  city_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  terminal_count INTEGER NOT NULL,
  gate_count INTEGER NOT NULL,
  open INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (world_id, airport_id)
);

CREATE TABLE IF NOT EXISTS aircraft (
  world_id TEXT NOT NULL,
  aircraft_id TEXT NOT NULL,
  model_tag TEXT NOT NULL,
  passenger_capacity INTEGER NOT NULL,
  fuel_level REAL NOT NULL DEFAULT 1,
  condition REAL NOT NULL DEFAULT 1,
  hangar_id TEXT,
  in_service INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (world_id, aircraft_id)
);

CREATE TABLE IF NOT EXISTS flights (
  world_id TEXT NOT NULL,
  flight_id TEXT NOT NULL,
  flight_type TEXT NOT NULL,
  origin_airport_id TEXT NOT NULL,
  destination_airport_id TEXT NOT NULL,
  aircraft_id TEXT NOT NULL,
  status TEXT NOT NULL,
  scheduled_departure TEXT NOT NULL,
  scheduled_arrival TEXT NOT NULL,
  gate_id TEXT,
  PRIMARY KEY (world_id, flight_id)
);

CREATE TABLE IF NOT EXISTS passenger_check_ins (
  world_id TEXT NOT NULL,
  check_in_id TEXT NOT NULL,
  flight_id TEXT NOT NULL,
  passenger_entity_id TEXT NOT NULL,
  travel_document_id TEXT,
  checked_in INTEGER NOT NULL DEFAULT 1,
  security_screening_completed INTEGER NOT NULL DEFAULT 0,
  immigration_checkpoint_completed INTEGER NOT NULL DEFAULT 0,
  boarding_eligible INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (world_id, check_in_id)
);

CREATE TABLE IF NOT EXISTS baggage_records (
  world_id TEXT NOT NULL,
  baggage_id TEXT NOT NULL,
  flight_id TEXT NOT NULL,
  passenger_entity_id TEXT NOT NULL,
  weight_kilograms REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  PRIMARY KEY (world_id, baggage_id)
);

CREATE TABLE IF NOT EXISTS aviation_crew_assignments (
  world_id TEXT NOT NULL,
  assignment_id TEXT NOT NULL,
  flight_id TEXT NOT NULL,
  person_entity_id TEXT NOT NULL,
  role TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (world_id, assignment_id)
);

CREATE TABLE IF NOT EXISTS aircraft_maintenance (
  world_id TEXT NOT NULL,
  maintenance_id TEXT NOT NULL,
  aircraft_id TEXT NOT NULL,
  maintenance_tag TEXT NOT NULL,
  status TEXT NOT NULL,
  scheduled_at TEXT NOT NULL,
  completed_at TEXT,
  PRIMARY KEY (world_id, maintenance_id)
);

CREATE TABLE IF NOT EXISTS air_cargo_records (
  world_id TEXT NOT NULL,
  cargo_id TEXT NOT NULL,
  flight_id TEXT NOT NULL,
  category_tag TEXT NOT NULL,
  weight_kilograms REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  PRIMARY KEY (world_id, cargo_id)
);

CREATE TABLE IF NOT EXISTS flight_disruptions (
  world_id TEXT NOT NULL,
  disruption_id TEXT NOT NULL,
  flight_id TEXT NOT NULL,
  disruption_type TEXT NOT NULL,
  reason_tag TEXT,
  delay_minutes INTEGER NOT NULL DEFAULT 0,
  resolved INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (world_id, disruption_id)
);
