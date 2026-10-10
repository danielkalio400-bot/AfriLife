CREATE TABLE IF NOT EXISTS citizenship_records (
  world_id TEXT NOT NULL,
  record_id TEXT NOT NULL,
  person_entity_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  status TEXT NOT NULL,
  effective_at TEXT NOT NULL,
  PRIMARY KEY (world_id, record_id)
);

CREATE TABLE IF NOT EXISTS passport_records (
  world_id TEXT NOT NULL,
  passport_record_id TEXT NOT NULL,
  person_entity_id TEXT NOT NULL,
  issuing_country_id TEXT NOT NULL,
  state TEXT NOT NULL,
  applied_at TEXT NOT NULL,
  issued_at TEXT,
  expires_at TEXT,
  PRIMARY KEY (world_id, passport_record_id)
);

CREATE TABLE IF NOT EXISTS visa_applications (
  world_id TEXT NOT NULL,
  application_id TEXT NOT NULL,
  person_entity_id TEXT NOT NULL,
  destination_country_id TEXT NOT NULL,
  visa_category TEXT NOT NULL,
  state TEXT NOT NULL,
  processing_office_id TEXT,
  submitted_at TEXT,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (world_id, application_id)
);

CREATE TABLE IF NOT EXISTS immigration_supporting_documents (
  world_id TEXT NOT NULL,
  document_id TEXT NOT NULL,
  application_id TEXT NOT NULL,
  document_type TEXT NOT NULL,
  reference_tag TEXT,
  accepted_for_review INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (world_id, document_id)
);

CREATE TABLE IF NOT EXISTS immigration_appointments (
  world_id TEXT NOT NULL,
  appointment_id TEXT NOT NULL,
  application_id TEXT NOT NULL,
  appointment_type TEXT NOT NULL,
  office_or_officer_id TEXT,
  scheduled_at TEXT NOT NULL,
  status TEXT NOT NULL,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  PRIMARY KEY (world_id, appointment_id)
);

CREATE TABLE IF NOT EXISTS immigration_processing_queue (
  world_id TEXT NOT NULL,
  queue_entry_id TEXT NOT NULL,
  application_id TEXT NOT NULL,
  office_id TEXT NOT NULL,
  position INTEGER NOT NULL,
  status TEXT NOT NULL,
  PRIMARY KEY (world_id, queue_entry_id)
);

CREATE TABLE IF NOT EXISTS immigration_permits (
  world_id TEXT NOT NULL,
  permit_id TEXT NOT NULL,
  person_entity_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  permit_type TEXT NOT NULL,
  source_application_id TEXT NOT NULL,
  starts_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (world_id, permit_id)
);

CREATE TABLE IF NOT EXISTS entry_exit_records (
  world_id TEXT NOT NULL,
  record_id TEXT NOT NULL,
  person_entity_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  border_point_id TEXT NOT NULL,
  direction TEXT NOT NULL,
  travel_document_id TEXT,
  officer_entity_id TEXT,
  recorded_at TEXT NOT NULL,
  PRIMARY KEY (world_id, record_id)
);
