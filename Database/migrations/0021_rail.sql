CREATE TABLE IF NOT EXISTS rail_stations (
  world_id TEXT NOT NULL,
  station_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  city_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  platform_count INTEGER NOT NULL,
  passenger_service INTEGER NOT NULL DEFAULT 1,
  freight_service INTEGER NOT NULL DEFAULT 0,
  open INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (world_id, station_id)
);

CREATE TABLE IF NOT EXISTS trains (
  world_id TEXT NOT NULL,
  train_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  train_type TEXT NOT NULL,
  passenger_capacity INTEGER NOT NULL DEFAULT 0,
  freight_capacity_kg REAL NOT NULL DEFAULT 0,
  condition REAL NOT NULL DEFAULT 1,
  depot_id TEXT NOT NULL,
  in_service INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (world_id, train_id)
);

CREATE TABLE IF NOT EXISTS rail_routes (
  world_id TEXT NOT NULL,
  route_id TEXT NOT NULL,
  origin_station_id TEXT NOT NULL,
  destination_station_id TEXT NOT NULL,
  distance_kilometers REAL NOT NULL,
  passenger_allowed INTEGER NOT NULL DEFAULT 1,
  freight_allowed INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (world_id, route_id)
);

CREATE TABLE IF NOT EXISTS rail_schedules (
  world_id TEXT NOT NULL,
  schedule_id TEXT NOT NULL,
  route_id TEXT NOT NULL,
  train_id TEXT NOT NULL,
  scheduled_departure TEXT NOT NULL,
  scheduled_arrival TEXT NOT NULL,
  status TEXT NOT NULL,
  PRIMARY KEY (world_id, schedule_id)
);

CREATE TABLE IF NOT EXISTS rail_tickets (
  world_id TEXT NOT NULL,
  ticket_id TEXT NOT NULL,
  schedule_id TEXT NOT NULL,
  passenger_entity_id TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  fare_minor_units INTEGER NOT NULL DEFAULT 0,
  valid INTEGER NOT NULL DEFAULT 1,
  used INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (world_id, ticket_id)
);

CREATE TABLE IF NOT EXISTS rail_crew_assignments (
  world_id TEXT NOT NULL,
  assignment_id TEXT NOT NULL,
  schedule_id TEXT NOT NULL,
  person_entity_id TEXT NOT NULL,
  role TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (world_id, assignment_id)
);

CREATE TABLE IF NOT EXISTS rail_depots (
  world_id TEXT NOT NULL,
  depot_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  city_id TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  occupied INTEGER NOT NULL DEFAULT 0,
  repair_facility INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (world_id, depot_id)
);

CREATE TABLE IF NOT EXISTS rail_repairs (
  world_id TEXT NOT NULL,
  repair_id TEXT NOT NULL,
  train_id TEXT NOT NULL,
  depot_id TEXT NOT NULL,
  repair_tag TEXT NOT NULL,
  status TEXT NOT NULL,
  scheduled_at TEXT NOT NULL,
  completed_at TEXT,
  PRIMARY KEY (world_id, repair_id)
);

CREATE TABLE IF NOT EXISTS rail_crossings (
  world_id TEXT NOT NULL,
  crossing_id TEXT NOT NULL,
  route_id TEXT NOT NULL,
  location_tag TEXT,
  open_to_road_traffic INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL,
  PRIMARY KEY (world_id, crossing_id)
);

CREATE TABLE IF NOT EXISTS rail_delays (
  world_id TEXT NOT NULL,
  delay_id TEXT NOT NULL,
  schedule_id TEXT NOT NULL,
  reason_tag TEXT,
  delay_minutes INTEGER NOT NULL,
  resolved INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (world_id, delay_id)
);
