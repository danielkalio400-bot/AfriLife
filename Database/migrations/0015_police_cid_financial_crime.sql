CREATE TABLE IF NOT EXISTS investigation_cases (
  world_id TEXT NOT NULL,
  case_id TEXT NOT NULL,
  case_type TEXT NOT NULL,
  state TEXT NOT NULL,
  lead_agency_id TEXT NOT NULL,
  region_id TEXT NOT NULL,
  opened_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (world_id, case_id)
);

CREATE TABLE IF NOT EXISTS case_statements (
  world_id TEXT NOT NULL,
  statement_id TEXT NOT NULL,
  case_id TEXT NOT NULL,
  person_entity_id TEXT NOT NULL,
  statement_tag TEXT,
  recorded_at TEXT NOT NULL,
  PRIMARY KEY (world_id, statement_id)
);

CREATE TABLE IF NOT EXISTS evidence_records (
  world_id TEXT NOT NULL,
  evidence_id TEXT NOT NULL,
  case_id TEXT NOT NULL,
  evidence_type TEXT NOT NULL,
  description_tag TEXT,
  current_custodian_id TEXT,
  collected_at TEXT NOT NULL,
  PRIMARY KEY (world_id, evidence_id)
);

CREATE TABLE IF NOT EXISTS evidence_chain_entries (
  world_id TEXT NOT NULL,
  chain_entry_id TEXT NOT NULL,
  evidence_id TEXT NOT NULL,
  from_custodian_id TEXT,
  to_custodian_id TEXT NOT NULL,
  action_tag TEXT,
  recorded_at TEXT NOT NULL,
  PRIMARY KEY (world_id, chain_entry_id)
);

CREATE TABLE IF NOT EXISTS suspicious_transaction_records (
  world_id TEXT NOT NULL,
  record_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  amount_minor_units INTEGER NOT NULL DEFAULT 0,
  reason_tag TEXT,
  review_status TEXT NOT NULL,
  flagged_at TEXT NOT NULL,
  PRIMARY KEY (world_id, record_id)
);

CREATE TABLE IF NOT EXISTS asset_freeze_orders (
  world_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  case_id TEXT NOT NULL,
  asset_id TEXT NOT NULL,
  legal_authority_ref TEXT NOT NULL,
  starts_at TEXT NOT NULL,
  ends_at TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (world_id, order_id)
);

CREATE TABLE IF NOT EXISTS agency_cooperation_records (
  world_id TEXT NOT NULL,
  cooperation_id TEXT NOT NULL,
  case_id TEXT NOT NULL,
  requesting_agency_id TEXT NOT NULL,
  responding_agency_id TEXT NOT NULL,
  request_tag TEXT,
  status TEXT NOT NULL,
  requested_at TEXT NOT NULL,
  PRIMARY KEY (world_id, cooperation_id)
);
