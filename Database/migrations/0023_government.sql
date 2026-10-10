CREATE TABLE IF NOT EXISTS government_officeholders (
  world_id TEXT NOT NULL,
  appointment_id TEXT NOT NULL,
  person_entity_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  region_id TEXT,
  office_type TEXT NOT NULL,
  portfolio_tag TEXT,
  term_starts_at TEXT NOT NULL,
  term_ends_at TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (world_id, appointment_id)
);

CREATE TABLE IF NOT EXISTS government_agencies (
  world_id TEXT NOT NULL,
  agency_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  mandate_tag TEXT,
  annual_budget_minor_units INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (world_id, agency_id)
);

CREATE TABLE IF NOT EXISTS legislative_measures (
  world_id TEXT NOT NULL,
  measure_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  title_tag TEXT NOT NULL,
  status TEXT NOT NULL,
  votes_for INTEGER NOT NULL DEFAULT 0,
  votes_against INTEGER NOT NULL DEFAULT 0,
  abstentions INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (world_id, measure_id)
);

CREATE TABLE IF NOT EXISTS public_budgets (
  world_id TEXT NOT NULL,
  budget_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  fiscal_period TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  planned_revenue_minor_units INTEGER NOT NULL DEFAULT 0,
  planned_spending_minor_units INTEGER NOT NULL DEFAULT 0,
  approved_spending_minor_units INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  PRIMARY KEY (world_id, budget_id)
);

CREATE TABLE IF NOT EXISTS treasury_state (
  world_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  balance_minor_units INTEGER NOT NULL DEFAULT 0,
  committed_minor_units INTEGER NOT NULL DEFAULT 0,
  spent_minor_units INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (world_id, country_id)
);

CREATE TABLE IF NOT EXISTS public_projects (
  world_id TEXT NOT NULL,
  project_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  region_id TEXT,
  project_type TEXT NOT NULL,
  approved_budget_minor_units INTEGER NOT NULL DEFAULT 0,
  spent_minor_units INTEGER NOT NULL DEFAULT 0,
  progress REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  PRIMARY KEY (world_id, project_id)
);

CREATE TABLE IF NOT EXISTS public_spending_records (
  world_id TEXT NOT NULL,
  spending_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  budget_id TEXT NOT NULL,
  agency_id TEXT NOT NULL,
  purpose_tag TEXT,
  amount_minor_units INTEGER NOT NULL,
  recorded_at TEXT NOT NULL,
  PRIMARY KEY (world_id, spending_id)
);

CREATE TABLE IF NOT EXISTS public_audits (
  world_id TEXT NOT NULL,
  audit_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  subject_type TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  outcome TEXT NOT NULL,
  finding_count INTEGER NOT NULL DEFAULT 0,
  completed_at TEXT,
  PRIMARY KEY (world_id, audit_id)
);

CREATE TABLE IF NOT EXISTS public_procurements (
  world_id TEXT NOT NULL,
  procurement_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  agency_id TEXT NOT NULL,
  requirement_tag TEXT NOT NULL,
  budget_ceiling_minor_units INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  selected_supplier_id TEXT,
  PRIMARY KEY (world_id, procurement_id)
);

CREATE TABLE IF NOT EXISTS fictional_elections (
  world_id TEXT NOT NULL,
  election_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  office_tag TEXT NOT NULL,
  status TEXT NOT NULL,
  scheduled_at TEXT NOT NULL,
  winner_candidate_id TEXT,
  total_votes_recorded INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (world_id, election_id)
);

CREATE TABLE IF NOT EXISTS fictional_election_candidates (
  world_id TEXT NOT NULL,
  candidate_id TEXT NOT NULL,
  election_id TEXT NOT NULL,
  person_entity_id TEXT NOT NULL,
  fictional_party_id TEXT NOT NULL,
  votes INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (world_id, candidate_id)
);

CREATE TABLE IF NOT EXISTS public_approval_state (
  world_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  approval REAL NOT NULL DEFAULT 0.5,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (world_id, country_id, subject_id)
);

CREATE TABLE IF NOT EXISTS government_services (
  world_id TEXT NOT NULL,
  service_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  service_type TEXT NOT NULL,
  region_id TEXT,
  capacity REAL NOT NULL DEFAULT 1,
  availability REAL NOT NULL DEFAULT 1,
  open INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (world_id, service_id)
);
