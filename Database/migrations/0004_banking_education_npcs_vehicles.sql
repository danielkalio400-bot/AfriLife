CREATE TABLE IF NOT EXISTS bank_accounts (
  world_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  owner_entity_id TEXT NOT NULL,
  bank_id TEXT NOT NULL,
  account_type TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  balance_minor_units INTEGER NOT NULL DEFAULT 0,
  frozen INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (world_id, account_id)
);

CREATE TABLE IF NOT EXISTS bank_transactions (
  world_id TEXT NOT NULL,
  transaction_id TEXT NOT NULL,
  from_account_id TEXT,
  to_account_id TEXT,
  currency_code TEXT NOT NULL,
  amount_minor_units INTEGER NOT NULL,
  memo TEXT NOT NULL DEFAULT '',
  occurred_at TEXT NOT NULL,
  PRIMARY KEY (world_id, transaction_id)
);

CREATE TABLE IF NOT EXISTS npc_runtime_state (
  world_id TEXT NOT NULL,
  npc_id TEXT NOT NULL,
  current_location_id TEXT,
  current_activity TEXT,
  runtime_json TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (world_id, npc_id)
);

CREATE TABLE IF NOT EXISTS npc_memory (
  world_id TEXT NOT NULL,
  memory_id TEXT NOT NULL,
  npc_id TEXT NOT NULL,
  memory_kind TEXT NOT NULL,
  related_entity_id TEXT,
  summary_key TEXT NOT NULL,
  importance REAL NOT NULL DEFAULT 0,
  occurred_at TEXT NOT NULL,
  PRIMARY KEY (world_id, memory_id)
);

CREATE TABLE IF NOT EXISTS vehicle_ownership (
  world_id TEXT NOT NULL,
  vehicle_id TEXT NOT NULL,
  owner_entity_id TEXT NOT NULL,
  vehicle_type TEXT NOT NULL,
  registration_id TEXT,
  insurance_policy_id TEXT,
  mileage_km REAL NOT NULL DEFAULT 0,
  fuel_liters REAL NOT NULL DEFAULT 0,
  state_json TEXT NOT NULL DEFAULT '{}',
  PRIMARY KEY (world_id, vehicle_id)
);

CREATE INDEX IF NOT EXISTS idx_npc_memory_npc
ON npc_memory(world_id, npc_id, occurred_at DESC);
