-- Prospective schema only; the running prototype uses memory.
-- Political actors and all negotiations are purely fictional.
CREATE TABLE IF NOT EXISTS fictional_bilateral_relations (
  relation_id TEXT PRIMARY KEY,
  phase TEXT NOT NULL,
  revision INTEGER NOT NULL CHECK(revision>=0),
  route_access_json TEXT NOT NULL,
  civilian_relief_01 REAL NOT NULL CHECK(civilian_relief_01 BETWEEN 0 AND 1),
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS fictional_diplomatic_proposals (
  proposal_id TEXT PRIMARY KEY,
  relation_id TEXT NOT NULL REFERENCES fictional_bilateral_relations(relation_id),
  from_phase TEXT NOT NULL,
  to_phase TEXT NOT NULL,
  scopes_json TEXT NOT NULL,
  proposer_country TEXT NOT NULL CHECK(proposer_country IN ('Nigeria','Ghana')),
  approvals_json TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  ratified_at TEXT
);
CREATE TABLE IF NOT EXISTS fictional_diplomatic_decisions (
  proposal_id TEXT NOT NULL REFERENCES fictional_diplomatic_proposals(proposal_id),
  actor_country TEXT NOT NULL CHECK(actor_country IN ('Nigeria','Ghana')),
  decision_id TEXT NOT NULL,
  approved INTEGER NOT NULL CHECK(approved IN (0,1)),
  PRIMARY KEY(proposal_id,actor_country,decision_id)
);
CREATE TABLE IF NOT EXISTS fictional_reconstruction_allocations (
  reconstruction_id TEXT PRIMARY KEY,
  country_id TEXT NOT NULL CHECK(country_id IN ('Nigeria','Ghana')),
  region_id TEXT NOT NULL,
  request_id TEXT NOT NULL,
  government_budget_id TEXT NOT NULL,
  government_agency_id TEXT NOT NULL,
  government_spending_id TEXT NOT NULL,
  government_project_id TEXT NOT NULL,
  amount_minor_units INTEGER NOT NULL CHECK(amount_minor_units>0),
  currency TEXT NOT NULL,
  recorded_at TEXT NOT NULL,
  UNIQUE(country_id,request_id)
);
