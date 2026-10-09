CREATE TABLE IF NOT EXISTS world_entities (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  country_code TEXT,
  city_id TEXT,
  state_json TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS world_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  entity_id TEXT,
  payload_json TEXT NOT NULL DEFAULT '{}',
  occurred_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_world_entities_type ON world_entities(entity_type);
CREATE INDEX IF NOT EXISTS idx_world_events_entity ON world_events(entity_id);
