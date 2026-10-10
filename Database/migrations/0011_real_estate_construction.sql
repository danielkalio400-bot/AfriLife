CREATE TABLE IF NOT EXISTS properties (
  world_id TEXT NOT NULL,
  property_id TEXT NOT NULL,
  owner_entity_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  city_id TEXT NOT NULL,
  neighborhood_id TEXT,
  property_type TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  purchase_price_minor_units INTEGER NOT NULL DEFAULT 0,
  estimated_value_minor_units INTEGER NOT NULL DEFAULT 0,
  occupied INTEGER NOT NULL DEFAULT 0,
  for_rent INTEGER NOT NULL DEFAULT 0,
  for_sale INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (world_id, property_id)
);

CREATE TABLE IF NOT EXISTS rental_agreements (
  world_id TEXT NOT NULL,
  agreement_id TEXT NOT NULL,
  property_id TEXT NOT NULL,
  landlord_entity_id TEXT NOT NULL,
  tenant_entity_id TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  rent_per_period_minor_units INTEGER NOT NULL,
  period_days INTEGER NOT NULL,
  starts_at INTEGER NOT NULL,
  ends_at INTEGER,
  active INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (world_id, agreement_id)
);

CREATE TABLE IF NOT EXISTS mortgages (
  world_id TEXT NOT NULL,
  mortgage_id TEXT NOT NULL,
  property_id TEXT NOT NULL,
  borrower_entity_id TEXT NOT NULL,
  bank_id TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  principal_minor_units INTEGER NOT NULL,
  outstanding_minor_units INTEGER NOT NULL,
  term_months INTEGER NOT NULL,
  payments_made INTEGER NOT NULL DEFAULT 0,
  game_interest_rate REAL NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (world_id, mortgage_id)
);

CREATE TABLE IF NOT EXISTS construction_projects (
  world_id TEXT NOT NULL,
  project_id TEXT NOT NULL,
  property_id TEXT NOT NULL,
  owner_entity_id TEXT NOT NULL,
  contractor_business_id TEXT,
  phase TEXT NOT NULL,
  phase_progress REAL NOT NULL DEFAULT 0,
  currency_code TEXT NOT NULL,
  budget_minor_units INTEGER NOT NULL DEFAULT 0,
  spent_minor_units INTEGER NOT NULL DEFAULT 0,
  project_json TEXT NOT NULL DEFAULT '{}',
  PRIMARY KEY (world_id, project_id)
);

CREATE TABLE IF NOT EXISTS property_work_orders (
  world_id TEXT NOT NULL,
  work_order_id TEXT NOT NULL,
  property_id TEXT NOT NULL,
  contractor_business_id TEXT,
  work_type TEXT NOT NULL,
  scope_tag TEXT,
  progress REAL NOT NULL DEFAULT 0,
  budget_minor_units INTEGER NOT NULL DEFAULT 0,
  completed INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (world_id, work_order_id)
);
