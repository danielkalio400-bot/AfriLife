CREATE TABLE IF NOT EXISTS player_employment (
  world_id TEXT NOT NULL,
  character_id TEXT NOT NULL,
  job_id TEXT NOT NULL,
  employer_id TEXT,
  completed_shifts INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (world_id, character_id)
);

CREATE TABLE IF NOT EXISTS player_bills (
  world_id TEXT NOT NULL,
  character_id TEXT NOT NULL,
  bill_id TEXT NOT NULL,
  bill_type TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  amount_minor_units INTEGER NOT NULL,
  due_at TEXT,
  paid INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (world_id, character_id, bill_id)
);

CREATE TABLE IF NOT EXISTS player_phone_state (
  world_id TEXT NOT NULL,
  character_id TEXT NOT NULL,
  device_id TEXT,
  provider_id TEXT,
  phone_number TEXT,
  remaining_data_mb INTEGER NOT NULL DEFAULT 0,
  data_expiry_at TEXT,
  PRIMARY KEY (world_id, character_id)
);

CREATE INDEX IF NOT EXISTS idx_player_bills_due
ON player_bills(world_id, character_id, paid, due_at);
