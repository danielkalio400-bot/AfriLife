CREATE TABLE IF NOT EXISTS national_fund_accounts (
  world_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  fund_type TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  balance_minor_units INTEGER NOT NULL DEFAULT 0,
  protected INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (world_id, account_id),
  UNIQUE(world_id, country_id, fund_type)
);

CREATE TABLE IF NOT EXISTS public_finance_audit_events (
  world_id TEXT NOT NULL,
  event_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  recorded_at TEXT NOT NULL,
  PRIMARY KEY (world_id, event_id)
);

CREATE TABLE IF NOT EXISTS citizen_dividend_eligibility (
  world_id TEXT NOT NULL,
  eligibility_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  person_entity_id TEXT NOT NULL,
  eligible INTEGER NOT NULL DEFAULT 0,
  reason_tag TEXT,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (world_id, eligibility_id),
  UNIQUE(world_id, country_id, person_entity_id)
);

CREATE TABLE IF NOT EXISTS citizen_dividend_runs (
  world_id TEXT NOT NULL,
  distribution_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  period_id TEXT NOT NULL,
  amount_per_recipient_minor_units INTEGER NOT NULL,
  recipient_count INTEGER NOT NULL,
  total_paid_minor_units INTEGER NOT NULL,
  currency_code TEXT NOT NULL,
  paid_at TEXT NOT NULL,
  PRIMARY KEY (world_id, distribution_id),
  UNIQUE(world_id, country_id, period_id)
);

CREATE TABLE IF NOT EXISTS citizen_dividend_payments (
  world_id TEXT NOT NULL,
  payment_id TEXT NOT NULL,
  distribution_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  period_id TEXT NOT NULL,
  person_entity_id TEXT NOT NULL,
  amount_minor_units INTEGER NOT NULL,
  currency_code TEXT NOT NULL,
  paid_at TEXT NOT NULL,
  PRIMARY KEY (world_id, payment_id)
);

CREATE TABLE IF NOT EXISTS dividend_economy_impact (
  world_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  period_id TEXT NOT NULL,
  liquidity_injection_minor_units INTEGER NOT NULL,
  recipient_count INTEGER NOT NULL,
  demand_index_delta REAL NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (world_id, country_id, period_id)
);
