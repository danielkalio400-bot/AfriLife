CREATE TABLE IF NOT EXISTS road_events (
  world_id TEXT NOT NULL,
  event_id TEXT NOT NULL,
  road_segment_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  severity REAL NOT NULL DEFAULT 0,
  blocks_traffic INTEGER NOT NULL DEFAULT 0,
  starts_at INTEGER NOT NULL,
  ends_at INTEGER,
  PRIMARY KEY (world_id, event_id)
);

CREATE TABLE IF NOT EXISTS transit_disruptions (
  world_id TEXT NOT NULL,
  disruption_id TEXT NOT NULL,
  route_id TEXT NOT NULL,
  disruption_type TEXT NOT NULL,
  delay_minutes INTEGER NOT NULL DEFAULT 0,
  service_suspended INTEGER NOT NULL DEFAULT 0,
  starts_at INTEGER NOT NULL,
  ends_at INTEGER,
  PRIMARY KEY (world_id, disruption_id)
);

CREATE TABLE IF NOT EXISTS telecom_outages (
  world_id TEXT NOT NULL,
  outage_id TEXT NOT NULL,
  region_id TEXT NOT NULL,
  outage_type TEXT NOT NULL,
  severity REAL NOT NULL DEFAULT 0,
  starts_at INTEGER NOT NULL,
  ends_at INTEGER,
  PRIMARY KEY (world_id, outage_id)
);

CREATE TABLE IF NOT EXISTS power_restoration_tasks (
  world_id TEXT NOT NULL,
  task_id TEXT NOT NULL,
  region_id TEXT NOT NULL,
  asset_id TEXT,
  severity REAL NOT NULL DEFAULT 0,
  progress REAL NOT NULL DEFAULT 0,
  assigned_crew_count INTEGER NOT NULL DEFAULT 0,
  critical_priority INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (world_id, task_id)
);

CREATE INDEX IF NOT EXISTS idx_road_events_segment
ON road_events(world_id, road_segment_id, starts_at);

CREATE INDEX IF NOT EXISTS idx_telecom_outages_region
ON telecom_outages(world_id, region_id, starts_at);
