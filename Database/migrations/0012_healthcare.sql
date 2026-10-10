CREATE TABLE IF NOT EXISTS healthcare_facilities (
  world_id TEXT NOT NULL,
  facility_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  country_id TEXT NOT NULL,
  city_id TEXT NOT NULL,
  neighborhood_id TEXT,
  facility_type TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 0,
  occupancy INTEGER NOT NULL DEFAULT 0,
  operations_json TEXT NOT NULL DEFAULT '{}',
  open INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (world_id, facility_id)
);

CREATE TABLE IF NOT EXISTS healthcare_visits (
  world_id TEXT NOT NULL,
  visit_id TEXT NOT NULL,
  patient_entity_id TEXT NOT NULL,
  facility_id TEXT NOT NULL,
  care_path TEXT NOT NULL,
  priority TEXT NOT NULL,
  status TEXT NOT NULL,
  arrived_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (world_id, visit_id)
);

CREATE TABLE IF NOT EXISTS ambulance_units (
  world_id TEXT NOT NULL,
  ambulance_id TEXT NOT NULL,
  home_facility_id TEXT NOT NULL,
  state TEXT NOT NULL,
  assigned_visit_id TEXT,
  runtime_json TEXT NOT NULL DEFAULT '{}',
  PRIMARY KEY (world_id, ambulance_id)
);

CREATE TABLE IF NOT EXISTS diagnostic_requests (
  world_id TEXT NOT NULL,
  request_id TEXT NOT NULL,
  visit_id TEXT NOT NULL,
  facility_id TEXT NOT NULL,
  diagnostic_type TEXT NOT NULL,
  status TEXT NOT NULL,
  queue_position INTEGER NOT NULL DEFAULT 0,
  ordered_at INTEGER NOT NULL,
  completed_at INTEGER,
  PRIMARY KEY (world_id, request_id)
);

CREATE TABLE IF NOT EXISTS medical_supply_shipments (
  world_id TEXT NOT NULL,
  shipment_id TEXT NOT NULL,
  supplier_business_id TEXT,
  destination_facility_id TEXT NOT NULL,
  supply_category TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  expected_at TEXT,
  PRIMARY KEY (world_id, shipment_id)
);

CREATE INDEX IF NOT EXISTS idx_healthcare_visits_facility_status
ON healthcare_visits(world_id, facility_id, status);
