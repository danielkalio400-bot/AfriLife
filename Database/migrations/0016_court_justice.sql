CREATE TABLE IF NOT EXISTS court_cases (
  world_id TEXT NOT NULL,
  case_id TEXT NOT NULL,
  court_type TEXT NOT NULL,
  state TEXT NOT NULL,
  filing_party_entity_id TEXT NOT NULL,
  responding_party_entity_id TEXT,
  subject_tag TEXT,
  assigned_judge_entity_id TEXT,
  filed_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (world_id, case_id)
);

CREATE TABLE IF NOT EXISTS court_case_participants (
  world_id TEXT NOT NULL,
  participant_id TEXT NOT NULL,
  case_id TEXT NOT NULL,
  person_entity_id TEXT NOT NULL,
  role TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (world_id, participant_id)
);

CREATE TABLE IF NOT EXISTS court_schedules (
  world_id TEXT NOT NULL,
  schedule_id TEXT NOT NULL,
  case_id TEXT NOT NULL,
  courtroom_id TEXT NOT NULL,
  starts_at TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (world_id, schedule_id)
);

CREATE TABLE IF NOT EXISTS court_decisions (
  world_id TEXT NOT NULL,
  decision_id TEXT NOT NULL,
  case_id TEXT NOT NULL,
  decision_type TEXT NOT NULL,
  fine_minor_units INTEGER NOT NULL DEFAULT 0,
  restitution_minor_units INTEGER NOT NULL DEFAULT 0,
  community_service_hours INTEGER NOT NULL DEFAULT 0,
  custodial_days INTEGER NOT NULL DEFAULT 0,
  decision_tag TEXT,
  decided_at TEXT NOT NULL,
  PRIMARY KEY (world_id, decision_id)
);

CREATE TABLE IF NOT EXISTS court_appeals (
  world_id TEXT NOT NULL,
  appeal_id TEXT NOT NULL,
  case_id TEXT NOT NULL,
  filed_by_entity_id TEXT NOT NULL,
  reason_tag TEXT,
  state TEXT NOT NULL,
  filed_at TEXT NOT NULL,
  PRIMARY KEY (world_id, appeal_id)
);

CREATE TABLE IF NOT EXISTS sentence_execution_state (
  world_id TEXT NOT NULL,
  execution_id TEXT NOT NULL,
  decision_id TEXT NOT NULL,
  fine_outstanding_minor_units INTEGER NOT NULL DEFAULT 0,
  restitution_outstanding_minor_units INTEGER NOT NULL DEFAULT 0,
  community_service_hours_remaining INTEGER NOT NULL DEFAULT 0,
  custodial_days_remaining INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  PRIMARY KEY (world_id, execution_id)
);
