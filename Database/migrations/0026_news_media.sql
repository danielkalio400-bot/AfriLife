CREATE TABLE IF NOT EXISTS media_outlets (
  world_id TEXT NOT NULL,
  outlet_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  channel_type TEXT NOT NULL,
  fictional INTEGER NOT NULL DEFAULT 1,
  active INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (world_id, outlet_id)
);

CREATE TABLE IF NOT EXISTS news_items (
  world_id TEXT NOT NULL,
  news_id TEXT NOT NULL,
  outlet_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  topic TEXT NOT NULL,
  headline_tag TEXT NOT NULL,
  summary_tag TEXT,
  region_id TEXT,
  source_system_tag TEXT,
  urgency INTEGER NOT NULL DEFAULT 0,
  published_at TEXT NOT NULL,
  PRIMARY KEY (world_id, news_id)
);

CREATE TABLE IF NOT EXISTS emergency_alerts (
  world_id TEXT NOT NULL,
  alert_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  region_id TEXT NOT NULL,
  alert_type TEXT NOT NULL,
  message_tag TEXT NOT NULL,
  severity INTEGER NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  starts_at TEXT NOT NULL,
  ends_at TEXT,
  resolved_at TEXT,
  PRIMARY KEY (world_id, alert_id)
);

CREATE TABLE IF NOT EXISTS broadcast_schedule (
  world_id TEXT NOT NULL,
  schedule_id TEXT NOT NULL,
  outlet_id TEXT NOT NULL,
  news_id TEXT NOT NULL,
  starts_at TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  status TEXT NOT NULL,
  PRIMARY KEY (world_id, schedule_id)
);

CREATE INDEX IF NOT EXISTS idx_news_feed_country_topic
ON news_items(country_id, topic, published_at DESC);

CREATE INDEX IF NOT EXISTS idx_emergency_alert_region
ON emergency_alerts(country_id, region_id, active, severity DESC);
