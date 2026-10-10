CREATE TABLE IF NOT EXISTS traffic_agents (
  world_id TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  agent_kind TEXT NOT NULL,
  current_road_segment_id TEXT,
  destination_road_segment_id TEXT,
  runtime_json TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (world_id, agent_id)
);

CREATE TABLE IF NOT EXISTS utility_invoices (
  world_id TEXT NOT NULL,
  invoice_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  utility_type TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  amount_minor_units INTEGER NOT NULL,
  issued_at INTEGER NOT NULL,
  due_at INTEGER NOT NULL,
  paid INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (world_id, invoice_id)
);

CREATE TABLE IF NOT EXISTS transit_passenger_state (
  world_id TEXT NOT NULL,
  passenger_id TEXT NOT NULL,
  origin_stop_id TEXT NOT NULL,
  destination_stop_id TEXT NOT NULL,
  runtime_json TEXT NOT NULL DEFAULT '{}',
  PRIMARY KEY (world_id, passenger_id)
);

CREATE TABLE IF NOT EXISTS business_runtime_state (
  world_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  neighborhood_id TEXT NOT NULL,
  business_type TEXT NOT NULL,
  runtime_json TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (world_id, business_id)
);

CREATE TABLE IF NOT EXISTS persistent_world_events (
  world_id TEXT NOT NULL,
  event_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  region_id TEXT,
  related_entity_id TEXT,
  payload_json TEXT NOT NULL DEFAULT '{}',
  occurred_at INTEGER NOT NULL,
  resolved INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (world_id, event_id)
);

CREATE INDEX IF NOT EXISTS idx_world_events_region
ON persistent_world_events(world_id, region_id, resolved, occurred_at);
