CREATE TABLE IF NOT EXISTS correctional_facilities (
  world_id TEXT NOT NULL,
  facility_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  region_id TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  occupancy INTEGER NOT NULL DEFAULT 0,
  open INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (world_id, facility_id)
);

CREATE TABLE IF NOT EXISTS incarceration_records (
  world_id TEXT NOT NULL,
  record_id TEXT NOT NULL,
  person_entity_id TEXT NOT NULL,
  court_decision_id TEXT NOT NULL,
  facility_id TEXT NOT NULL,
  cell_id TEXT,
  state TEXT NOT NULL,
  sentence_days INTEGER NOT NULL,
  days_served INTEGER NOT NULL DEFAULT 0,
  started_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (world_id, record_id)
);

CREATE TABLE IF NOT EXISTS correctional_program_enrollments (
  world_id TEXT NOT NULL,
  enrollment_id TEXT NOT NULL,
  record_id TEXT NOT NULL,
  program_type TEXT NOT NULL,
  planned_sessions INTEGER NOT NULL,
  completed_sessions INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (world_id, enrollment_id)
);

CREATE TABLE IF NOT EXISTS correctional_visits (
  world_id TEXT NOT NULL,
  visit_id TEXT NOT NULL,
  record_id TEXT NOT NULL,
  visitor_entity_id TEXT NOT NULL,
  visit_type TEXT NOT NULL,
  scheduled_at TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  status TEXT NOT NULL,
  PRIMARY KEY (world_id, visit_id)
);

CREATE TABLE IF NOT EXISTS correctional_health_requests (
  world_id TEXT NOT NULL,
  request_id TEXT NOT NULL,
  record_id TEXT NOT NULL,
  priority TEXT NOT NULL,
  status TEXT NOT NULL,
  requested_at TEXT NOT NULL,
  PRIMARY KEY (world_id, request_id)
);

CREATE TABLE IF NOT EXISTS parole_reviews (
  world_id TEXT NOT NULL,
  review_id TEXT NOT NULL,
  record_id TEXT NOT NULL,
  state TEXT NOT NULL,
  minimum_days_required INTEGER NOT NULL,
  reviewed_at TEXT NOT NULL,
  outcome_tag TEXT,
  PRIMARY KEY (world_id, review_id)
);

CREATE TABLE IF NOT EXISTS reintegration_plans (
  world_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  person_entity_id TEXT NOT NULL,
  plan_json TEXT NOT NULL DEFAULT '{}',
  status TEXT NOT NULL,
  PRIMARY KEY (world_id, plan_id)
);
