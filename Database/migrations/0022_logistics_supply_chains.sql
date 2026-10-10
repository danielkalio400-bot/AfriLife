CREATE TABLE IF NOT EXISTS logistics_warehouses (
  world_id TEXT NOT NULL,
  warehouse_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  city_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  capacity_units REAL NOT NULL,
  occupied_units REAL NOT NULL DEFAULT 0,
  open INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (world_id, warehouse_id)
);

CREATE TABLE IF NOT EXISTS logistics_distribution_centers (
  world_id TEXT NOT NULL,
  distribution_center_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  city_id TEXT NOT NULL,
  throughput_units_per_day REAL NOT NULL,
  open INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (world_id, distribution_center_id)
);

CREATE TABLE IF NOT EXISTS logistics_trucks (
  world_id TEXT NOT NULL,
  truck_id TEXT NOT NULL,
  operator_entity_id TEXT NOT NULL,
  capacity_units REAL NOT NULL,
  fuel_level REAL NOT NULL DEFAULT 1,
  condition REAL NOT NULL DEFAULT 1,
  available INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (world_id, truck_id)
);

CREATE TABLE IF NOT EXISTS logistics_couriers (
  world_id TEXT NOT NULL,
  courier_id TEXT NOT NULL,
  person_entity_id TEXT NOT NULL,
  city_id TEXT NOT NULL,
  active_deliveries INTEGER NOT NULL DEFAULT 0,
  available INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (world_id, courier_id)
);

CREATE TABLE IF NOT EXISTS logistics_inventory_movements (
  world_id TEXT NOT NULL,
  movement_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  quantity REAL NOT NULL,
  origin_node_id TEXT NOT NULL,
  destination_node_id TEXT NOT NULL,
  transport_mode TEXT NOT NULL,
  transport_resource_id TEXT,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (world_id, movement_id)
);

CREATE TABLE IF NOT EXISTS logistics_delivery_tracking (
  world_id TEXT NOT NULL,
  delivery_id TEXT NOT NULL,
  movement_id TEXT NOT NULL,
  status TEXT NOT NULL,
  current_node_id TEXT NOT NULL,
  progress REAL NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (world_id, delivery_id)
);

CREATE TABLE IF NOT EXISTS logistics_supply_shortages (
  world_id TEXT NOT NULL,
  shortage_id TEXT NOT NULL,
  region_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  severity REAL NOT NULL,
  cause_tag TEXT,
  resolved INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (world_id, shortage_id)
);

CREATE TABLE IF NOT EXISTS logistics_suppliers (
  world_id TEXT NOT NULL,
  supplier_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  country_id TEXT NOT NULL,
  available_units REAL NOT NULL DEFAULT 0,
  unit_price_minor_units INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (world_id, supplier_id)
);

CREATE TABLE IF NOT EXISTS logistics_customs_clearances (
  world_id TEXT NOT NULL,
  clearance_id TEXT NOT NULL,
  movement_id TEXT NOT NULL,
  border_or_port_id TEXT NOT NULL,
  status TEXT NOT NULL,
  outcome_tag TEXT,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (world_id, clearance_id)
);

CREATE TABLE IF NOT EXISTS logistics_fuel_dependency (
  world_id TEXT NOT NULL,
  network_id TEXT NOT NULL,
  fuel_availability REAL NOT NULL,
  road_capacity_multiplier REAL NOT NULL,
  courier_capacity_multiplier REAL NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (world_id, network_id)
);
