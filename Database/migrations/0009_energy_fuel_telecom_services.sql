CREATE TABLE IF NOT EXISTS backup_energy_assets (
  world_id TEXT NOT NULL,
  asset_id TEXT NOT NULL,
  asset_type TEXT NOT NULL,
  owner_entity_id TEXT,
  runtime_json TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (world_id, asset_id)
);

CREATE TABLE IF NOT EXISTS fuel_inventory (
  world_id TEXT NOT NULL,
  storage_id TEXT NOT NULL,
  fuel_type TEXT NOT NULL,
  available_liters REAL NOT NULL DEFAULT 0,
  reserved_liters REAL NOT NULL DEFAULT 0,
  capacity_liters REAL NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (world_id, storage_id, fuel_type)
);

CREATE TABLE IF NOT EXISTS strategic_fuel_reserves (
  world_id TEXT NOT NULL,
  reserve_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  fuel_type TEXT NOT NULL,
  stored_liters REAL NOT NULL DEFAULT 0,
  capacity_liters REAL NOT NULL DEFAULT 0,
  minimum_target_liters REAL NOT NULL DEFAULT 0,
  PRIMARY KEY (world_id, reserve_id)
);

CREATE TABLE IF NOT EXISTS telecom_accounts (
  world_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  provider_id TEXT,
  country_id TEXT NOT NULL,
  airtime_minor_units INTEGER NOT NULL DEFAULT 0,
  data_megabytes INTEGER NOT NULL DEFAULT 0,
  data_expiry_at INTEGER,
  roaming_enabled INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (world_id, account_id)
);

CREATE TABLE IF NOT EXISTS service_work_orders (
  world_id TEXT NOT NULL,
  work_order_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  customer_entity_id TEXT NOT NULL,
  asset_id TEXT,
  service_type TEXT NOT NULL,
  progress REAL NOT NULL DEFAULT 0,
  assigned_workers INTEGER NOT NULL DEFAULT 0,
  price_minor_units INTEGER NOT NULL DEFAULT 0,
  completed INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (world_id, work_order_id)
);

CREATE TABLE IF NOT EXISTS infrastructure_events (
  world_id TEXT NOT NULL,
  event_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  region_id TEXT,
  asset_id TEXT,
  severity REAL NOT NULL DEFAULT 0,
  starts_at INTEGER NOT NULL,
  ends_at INTEGER,
  resolved INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (world_id, event_id)
);
