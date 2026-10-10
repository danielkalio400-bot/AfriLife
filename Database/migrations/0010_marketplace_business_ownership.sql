CREATE TABLE IF NOT EXISTS marketplace_sellers (
  world_id TEXT NOT NULL,
  seller_id TEXT NOT NULL,
  business_id TEXT,
  country_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  reputation REAL NOT NULL DEFAULT 0.5,
  completed_orders INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (world_id, seller_id)
);

CREATE TABLE IF NOT EXISTS marketplace_listings (
  world_id TEXT NOT NULL,
  listing_id TEXT NOT NULL,
  seller_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  title TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  unit_price_minor_units INTEGER NOT NULL,
  available_quantity INTEGER NOT NULL,
  warehouse_id TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (world_id, listing_id)
);

CREATE TABLE IF NOT EXISTS marketplace_orders (
  world_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  buyer_entity_id TEXT NOT NULL,
  seller_id TEXT NOT NULL,
  listing_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  currency_code TEXT NOT NULL,
  total_minor_units INTEGER NOT NULL,
  state TEXT NOT NULL,
  delivery_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (world_id, order_id)
);

CREATE TABLE IF NOT EXISTS marketplace_disputes (
  world_id TEXT NOT NULL,
  dispute_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  buyer_entity_id TEXT NOT NULL,
  seller_id TEXT NOT NULL,
  reason_code TEXT NOT NULL,
  state TEXT NOT NULL,
  opened_at TEXT NOT NULL,
  PRIMARY KEY (world_id, dispute_id)
);

CREATE TABLE IF NOT EXISTS owned_businesses (
  world_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  owner_entity_id TEXT NOT NULL,
  legal_name TEXT NOT NULL,
  country_id TEXT NOT NULL,
  business_type TEXT NOT NULL,
  cash_minor_units INTEGER NOT NULL DEFAULT 0,
  reputation REAL NOT NULL DEFAULT 0.5,
  registered INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (world_id, business_id)
);

CREATE TABLE IF NOT EXISTS business_employees (
  world_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  employee_npc_id TEXT NOT NULL,
  role_id TEXT NOT NULL,
  salary_minor_units INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (world_id, business_id, employee_npc_id)
);

CREATE TABLE IF NOT EXISTS supplier_contracts (
  world_id TEXT NOT NULL,
  contract_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  supplier_business_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  unit_cost_minor_units INTEGER NOT NULL,
  quantity_per_delivery INTEGER NOT NULL,
  delivery_interval_days INTEGER NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (world_id, contract_id)
);

CREATE TABLE IF NOT EXISTS delivery_jobs (
  world_id TEXT NOT NULL,
  delivery_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  origin_warehouse_id TEXT,
  destination_id TEXT NOT NULL,
  driver_npc_id TEXT,
  vehicle_id TEXT,
  state TEXT NOT NULL,
  distance_km REAL NOT NULL DEFAULT 0,
  progress_km REAL NOT NULL DEFAULT 0,
  PRIMARY KEY (world_id, delivery_id)
);
