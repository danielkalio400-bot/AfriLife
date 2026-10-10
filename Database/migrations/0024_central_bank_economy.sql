CREATE TABLE IF NOT EXISTS national_macro_state (
  world_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  currency_supply_minor_units INTEGER NOT NULL DEFAULT 0,
  policy_interest_rate_basis_points INTEGER NOT NULL DEFAULT 0,
  inflation_basis_points INTEGER NOT NULL DEFAULT 0,
  foreign_reserves_reference_units INTEGER NOT NULL DEFAULT 0,
  national_debt_minor_units INTEGER NOT NULL DEFAULT 0,
  productivity_index REAL NOT NULL DEFAULT 1,
  currency_stability REAL NOT NULL DEFAULT 0.5,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (world_id, country_id)
);

CREATE TABLE IF NOT EXISTS monetary_policy_decisions (
  world_id TEXT NOT NULL,
  decision_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  policy_interest_rate_basis_points INTEGER NOT NULL,
  currency_supply_delta_minor_units INTEGER NOT NULL,
  reason_tag TEXT,
  recorded_at TEXT NOT NULL,
  PRIMARY KEY (world_id, decision_id)
);

CREATE TABLE IF NOT EXISTS exchange_rate_state (
  world_id TEXT NOT NULL,
  base_currency TEXT NOT NULL,
  quote_currency TEXT NOT NULL,
  quote_per_base REAL NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (world_id, base_currency, quote_currency)
);

CREATE TABLE IF NOT EXISTS national_trade_records (
  world_id TEXT NOT NULL,
  trade_record_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  fiscal_period TEXT NOT NULL,
  imports_minor_units INTEGER NOT NULL DEFAULT 0,
  exports_minor_units INTEGER NOT NULL DEFAULT 0,
  trade_balance_minor_units INTEGER NOT NULL DEFAULT 0,
  recorded_at TEXT NOT NULL,
  PRIMARY KEY (world_id, trade_record_id)
);

CREATE TABLE IF NOT EXISTS banking_regulation_state (
  world_id TEXT NOT NULL,
  regulation_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  policy_tag TEXT NOT NULL,
  capital_requirement REAL NOT NULL DEFAULT 0,
  liquidity_requirement REAL NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (world_id, regulation_id)
);
