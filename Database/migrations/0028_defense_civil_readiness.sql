-- Development schema; current API uses in-memory stores.
-- No tactical operational data, weapon specifications or real government data.
CREATE TABLE IF NOT EXISTS fictional_defense_institutions (
  institution_id TEXT PRIMARY KEY,
  country_id TEXT NOT NULL CHECK(country_id IN ('Nigeria','Ghana')),
  region_id TEXT NOT NULL,
  branch TEXT NOT NULL CHECK(branch IN ('army','navy','air-force','civil-support')),
  category TEXT NOT NULL,
  maintenance_01 REAL NOT NULL CHECK(maintenance_01 BETWEEN 0 AND 1),
  fuel_availability_01 REAL NOT NULL CHECK(fuel_availability_01 BETWEEN 0 AND 1),
  medical_support_01 REAL NOT NULL CHECK(medical_support_01 BETWEEN 0 AND 1),
  service_capacity_01 REAL NOT NULL CHECK(service_capacity_01 BETWEEN 0 AND 1),
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS fictional_defense_allocations (
  allocation_id TEXT PRIMARY KEY,
  country_id TEXT NOT NULL CHECK(country_id IN ('Nigeria','Ghana')),
  request_id TEXT NOT NULL,
  institution_id TEXT NOT NULL,
  government_budget_id TEXT NOT NULL,
  government_agency_id TEXT NOT NULL,
  government_spending_id TEXT NOT NULL,
  currency TEXT NOT NULL,
  purpose TEXT NOT NULL,
  amount_minor_units INTEGER NOT NULL CHECK(amount_minor_units > 0),
  recorded_at TEXT NOT NULL,
  UNIQUE(country_id,request_id)
);
CREATE TABLE IF NOT EXISTS fictional_civilian_conditions (
  country_id TEXT NOT NULL CHECK(country_id IN ('Nigeria','Ghana')),
  region_id TEXT NOT NULL,
  state TEXT NOT NULL,
  pressure_01 REAL NOT NULL CHECK(pressure_01 BETWEEN 0 AND 1),
  transport_reliability_01 REAL NOT NULL CHECK(transport_reliability_01 BETWEEN 0 AND 1),
  hospital_availability_01 REAL NOT NULL CHECK(hospital_availability_01 BETWEEN 0 AND 1),
  supply_reliability_01 REAL NOT NULL CHECK(supply_reliability_01 BETWEEN 0 AND 1),
  assistance_demand_01 REAL NOT NULL CHECK(assistance_demand_01 BETWEEN 0 AND 1),
  updated_at TEXT NOT NULL,
  PRIMARY KEY(country_id,region_id)
);
