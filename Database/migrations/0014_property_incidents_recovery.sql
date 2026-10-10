CREATE TABLE IF NOT EXISTS property_incidents (
  world_id TEXT NOT NULL,
  incident_id TEXT NOT NULL,
  owner_entity_id TEXT NOT NULL,
  region_id TEXT NOT NULL,
  incident_type TEXT NOT NULL,
  item_record_id TEXT NOT NULL,
  status TEXT NOT NULL,
  reported_at TEXT NOT NULL,
  recovered INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (world_id, incident_id)
);

CREATE TABLE IF NOT EXISTS stolen_item_records (
  world_id TEXT NOT NULL,
  item_record_id TEXT NOT NULL,
  owner_entity_id TEXT NOT NULL,
  category TEXT NOT NULL,
  description_tag TEXT,
  serial_or_registration_tag TEXT,
  recovered INTEGER NOT NULL DEFAULT 0,
  recovered_at TEXT,
  PRIMARY KEY (world_id, item_record_id)
);

CREATE TABLE IF NOT EXISTS property_incident_evidence (
  world_id TEXT NOT NULL,
  evidence_id TEXT NOT NULL,
  incident_id TEXT NOT NULL,
  evidence_type TEXT NOT NULL,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  recorded_at TEXT NOT NULL,
  PRIMARY KEY (world_id, evidence_id)
);

CREATE TABLE IF NOT EXISTS property_police_reports (
  world_id TEXT NOT NULL,
  report_id TEXT NOT NULL,
  incident_id TEXT NOT NULL,
  reporting_entity_id TEXT NOT NULL,
  station_id TEXT NOT NULL,
  status TEXT NOT NULL,
  filed_at TEXT NOT NULL,
  PRIMARY KEY (world_id, report_id)
);

CREATE TABLE IF NOT EXISTS property_recoveries (
  world_id TEXT NOT NULL,
  recovery_id TEXT NOT NULL,
  incident_id TEXT NOT NULL,
  item_record_id TEXT NOT NULL,
  recovery_source TEXT,
  recovered_at TEXT NOT NULL,
  returned_to_owner INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (world_id, recovery_id)
);

CREATE TABLE IF NOT EXISTS property_insurance_claims (
  world_id TEXT NOT NULL,
  claim_id TEXT NOT NULL,
  incident_id TEXT NOT NULL,
  policy_id TEXT NOT NULL,
  claimant_entity_id TEXT NOT NULL,
  claimed_amount_minor_units INTEGER NOT NULL DEFAULT 0,
  state TEXT NOT NULL,
  submitted_at TEXT NOT NULL,
  PRIMARY KEY (world_id, claim_id)
);

CREATE TABLE IF NOT EXISTS property_investigations (
  world_id TEXT NOT NULL,
  investigation_id TEXT NOT NULL,
  incident_id TEXT NOT NULL,
  state TEXT NOT NULL,
  evidence_record_count INTEGER NOT NULL DEFAULT 0,
  witness_record_count INTEGER NOT NULL DEFAULT 0,
  item_recovered INTEGER NOT NULL DEFAULT 0,
  opened_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (world_id, investigation_id)
);
