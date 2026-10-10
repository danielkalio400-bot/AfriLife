-- Prospective durable adapter, not wired to the in-memory local development API.
CREATE TABLE IF NOT EXISTS environmental_disruption (
  incident_id UUID PRIMARY KEY,
  country_id TEXT NOT NULL CHECK (country_id IN ('Nigeria','Ghana')),
  region_id TEXT NOT NULL,
  domain TEXT NOT NULL CHECK (domain IN ('road','grid','aviation','maritime','agriculture')),
  source_weather_state_id UUID NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('disrupted','recovering','restored')),
  severity_01 NUMERIC(5,4) NOT NULL CHECK (severity_01 BETWEEN 0 AND 1),
  recovery_01 NUMERIC(5,4) NOT NULL CHECK (recovery_01 BETWEEN 0 AND 1),
  modifiers JSONB NOT NULL DEFAULT '{}'::jsonb,
  media_alert_id UUID,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  restored_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS environmental_disruption_location_idx
  ON environmental_disruption(country_id,region_id,status);
CREATE TABLE IF NOT EXISTS environmental_disruption_requests (
  country_id TEXT NOT NULL,
  request_id TEXT NOT NULL,
  incident_id UUID NOT NULL REFERENCES environmental_disruption(incident_id),
  region_id TEXT NOT NULL,
  domain TEXT NOT NULL,
  PRIMARY KEY (country_id,request_id)
);
CREATE TABLE IF NOT EXISTS environmental_response_work_order (
  incident_id UUID NOT NULL REFERENCES environmental_disruption(incident_id),
  work_order_id TEXT NOT NULL,
  effort_01 NUMERIC(5,4) NOT NULL CHECK (effort_01 > 0 AND effort_01 <= 1),
  PRIMARY KEY (incident_id,work_order_id)
);
