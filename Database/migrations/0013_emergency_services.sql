CREATE TABLE IF NOT EXISTS emergency_calls (
  world_id TEXT NOT NULL,
  call_id TEXT NOT NULL,
  caller_entity_id TEXT NOT NULL,
  region_id TEXT NOT NULL,
  location_tag TEXT,
  incident_type TEXT NOT NULL,
  priority TEXT NOT NULL,
  status TEXT NOT NULL,
  received_at TEXT NOT NULL,
  PRIMARY KEY (world_id, call_id)
);

CREATE TABLE IF NOT EXISTS emergency_incidents (
  world_id TEXT NOT NULL,
  incident_id TEXT NOT NULL,
  call_id TEXT NOT NULL,
  region_id TEXT NOT NULL,
  incident_type TEXT NOT NULL,
  priority TEXT NOT NULL,
  status TEXT NOT NULL,
  traffic_diversion_requested INTEGER NOT NULL DEFAULT 0,
  hospital_transport_requested INTEGER NOT NULL DEFAULT 0,
  destination_facility_id TEXT,
  opened_at TEXT NOT NULL,
  resolved_at TEXT,
  PRIMARY KEY (world_id, incident_id)
);

CREATE TABLE IF NOT EXISTS emergency_units (
  world_id TEXT NOT NULL,
  unit_id TEXT NOT NULL,
  unit_type TEXT NOT NULL,
  region_id TEXT NOT NULL,
  home_base_id TEXT,
  assigned_incident_id TEXT,
  available INTEGER NOT NULL DEFAULT 1,
  condition REAL NOT NULL DEFAULT 1,
  fuel_level REAL NOT NULL DEFAULT 1,
  PRIMARY KEY (world_id, unit_id)
);

CREATE TABLE IF NOT EXISTS after_incident_reports (
  world_id TEXT NOT NULL,
  report_id TEXT NOT NULL,
  incident_id TEXT NOT NULL,
  outcome_code TEXT NOT NULL,
  report_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (world_id, report_id)
);

CREATE INDEX IF NOT EXISTS idx_emergency_incidents_region_status
ON emergency_incidents(world_id, region_id, status, priority);
