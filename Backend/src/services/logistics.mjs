import { randomUUID } from "node:crypto";

const COUNTRIES = new Set(["Nigeria", "Ghana"]);
const MODES = new Set(["truck", "rail-freight", "air-cargo", "maritime-cargo", "courier"]);
const MOVEMENT_STATES = new Set(["planned", "queued", "in-transit", "held", "delivered", "cancelled"]);

export class LogisticsService {
  #warehouses = new Map();
  #distributionCenters = new Map();
  #trucks = new Map();
  #couriers = new Map();
  #suppliers = new Map();
  #movements = new Map();
  #tracking = new Map();
  #shortages = new Map();
  #clearances = new Map();
  #fuelNetworks = new Map();

  registerWarehouse(input) {
    const countryId = String(input?.countryId || "").trim();
    const cityId = String(input?.cityId || "").trim();
    const displayName = String(input?.displayName || "").trim().slice(0, 120);
    if (!COUNTRIES.has(countryId) || !cityId || !displayName)
      return { ok: false, error: "invalid_warehouse" };

    const warehouse = {
      warehouseId: String(input?.warehouseId || randomUUID()),
      countryId,
      cityId,
      displayName,
      capacityUnits: Math.max(1, Number(input?.capacityUnits) || 1),
      occupiedUnits: Math.max(0, Number(input?.occupiedUnits) || 0),
      open: input?.open !== false,
    };
    if (warehouse.occupiedUnits > warehouse.capacityUnits)
      return { ok: false, error: "warehouse_capacity_exceeded" };

    this.#warehouses.set(warehouse.warehouseId, warehouse);
    return { ok: true, warehouse: { ...warehouse } };
  }

  registerDistributionCenter(input) {
    const countryId = String(input?.countryId || "").trim();
    const cityId = String(input?.cityId || "").trim();
    if (!COUNTRIES.has(countryId) || !cityId)
      return { ok: false, error: "invalid_distribution_center" };

    const center = {
      distributionCenterId: String(input?.distributionCenterId || randomUUID()),
      countryId,
      cityId,
      throughputUnitsPerDay: Math.max(1, Number(input?.throughputUnitsPerDay) || 1),
      open: input?.open !== false,
    };
    this.#distributionCenters.set(center.distributionCenterId, center);
    return { ok: true, distributionCenter: { ...center } };
  }

  registerTruck(input) {
    const truck = {
      truckId: String(input?.truckId || randomUUID()),
      operatorEntityId: String(input?.operatorEntityId || "").trim(),
      capacityUnits: Math.max(1, Number(input?.capacityUnits) || 1),
      fuelLevel01: Math.max(0, Math.min(1, Number(input?.fuelLevel01) || 1)),
      condition01: Math.max(0, Math.min(1, Number(input?.condition01) || 1)),
      available: input?.available !== false,
    };
    if (!truck.operatorEntityId) return { ok: false, error: "invalid_truck" };
    this.#trucks.set(truck.truckId, truck);
    return { ok: true, truck: { ...truck } };
  }

  registerCourier(input) {
    const courier = {
      courierId: String(input?.courierId || randomUUID()),
      personEntityId: String(input?.personEntityId || "").trim(),
      cityId: String(input?.cityId || "").trim(),
      activeDeliveries: Math.max(0, Math.trunc(Number(input?.activeDeliveries) || 0)),
      available: input?.available !== false,
    };
    if (!courier.personEntityId || !courier.cityId)
      return { ok: false, error: "invalid_courier" };
    this.#couriers.set(courier.courierId, courier);
    return { ok: true, courier: { ...courier } };
  }

  registerSupplier(input) {
    const countryId = String(input?.countryId || "").trim();
    const itemId = String(input?.itemId || "").trim();
    if (!COUNTRIES.has(countryId) || !itemId)
      return { ok: false, error: "invalid_supplier" };

    const supplier = {
      supplierId: String(input?.supplierId || randomUUID()),
      itemId,
      countryId,
      availableUnits: Math.max(0, Number(input?.availableUnits) || 0),
      unitPriceMinorUnits: Math.max(0, Math.trunc(Number(input?.unitPriceMinorUnits) || 0)),
      active: input?.active !== false,
    };
    this.#suppliers.set(supplier.supplierId, supplier);
    return { ok: true, supplier: { ...supplier } };
  }

  createMovement(input) {
    const itemId = String(input?.itemId || "").trim();
    const originNodeId = String(input?.originNodeId || "").trim();
    const destinationNodeId = String(input?.destinationNodeId || "").trim();
    const transportMode = String(input?.transportMode || "").trim();
    const quantity = Math.max(0, Number(input?.quantity) || 0);
    if (!itemId || !originNodeId || !destinationNodeId || originNodeId === destinationNodeId ||
        !MODES.has(transportMode) || quantity <= 0)
      return { ok: false, error: "invalid_inventory_movement" };

    const movement = {
      movementId: randomUUID(),
      itemId,
      quantity,
      originNodeId,
      destinationNodeId,
      transportMode,
      status: "planned",
      transportResourceId: String(input?.transportResourceId || "").trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (transportMode === "truck" && movement.transportResourceId) {
      const truck = this.#trucks.get(movement.transportResourceId);
      if (!truck || !truck.available || truck.condition01 <= 0.2 || truck.fuelLevel01 <= 0.05)
        return { ok: false, error: "truck_unavailable" };
      if (quantity > truck.capacityUnits)
        return { ok: false, error: "truck_capacity_exceeded" };
    }

    this.#movements.set(movement.movementId, movement);
    const delivery = {
      deliveryId: randomUUID(),
      movementId: movement.movementId,
      status: "created",
      currentNodeId: originNodeId,
      progress01: 0,
      updatedAt: new Date().toISOString(),
    };
    this.#tracking.set(delivery.deliveryId, delivery);
    return { ok: true, movement: { ...movement }, delivery: { ...delivery } };
  }

  updateMovement(movementId, input) {
    const movement = this.#movements.get(movementId);
    if (!movement) return { ok: false, error: "inventory_movement_not_found" };
    const status = String(input?.status || "").trim();
    if (!MOVEMENT_STATES.has(status))
      return { ok: false, error: "invalid_inventory_movement_state" };

    movement.status = status;
    movement.updatedAt = new Date().toISOString();

    const delivery = [...this.#tracking.values()].find(entry => entry.movementId === movementId);
    if (delivery) {
      delivery.status = status === "delivered" ? "delivered" : status;
      if (input?.currentNodeId) delivery.currentNodeId = String(input.currentNodeId).trim();
      if (input?.progress01 !== undefined)
        delivery.progress01 = Math.max(0, Math.min(1, Number(input.progress01) || 0));
      if (status === "delivered") delivery.progress01 = 1;
      delivery.updatedAt = new Date().toISOString();
    }

    return { ok: true, movement: { ...movement }, delivery: delivery ? { ...delivery } : null };
  }

  getTracking(deliveryId) {
    const state = this.#tracking.get(String(deliveryId || ""));
    return state ? { ...state } : null;
  }

  recordShortage(input) {
    const regionId = String(input?.regionId || "").trim();
    const itemId = String(input?.itemId || "").trim();
    if (!regionId || !itemId) return { ok: false, error: "invalid_supply_shortage" };

    const shortage = {
      shortageId: randomUUID(),
      regionId,
      itemId,
      severity01: Math.max(0, Math.min(1, Number(input?.severity01) || 0)),
      causeTag: String(input?.causeTag || "supply-gap").slice(0, 80),
      resolved: false,
    };
    this.#shortages.set(shortage.shortageId, shortage);
    return { ok: true, shortage: { ...shortage } };
  }

  alternativeSuppliers(itemId, excludeCountryId = "") {
    return [...this.#suppliers.values()]
      .filter(supplier => supplier.active && supplier.itemId === itemId &&
        supplier.availableUnits > 0 && supplier.countryId !== excludeCountryId)
      .sort((a, b) => a.unitPriceMinorUnits - b.unitPriceMinorUnits)
      .map(supplier => ({ ...supplier }));
  }

  createCustomsClearance(movementId, input) {
    if (!this.#movements.has(movementId))
      return { ok: false, error: "inventory_movement_not_found" };

    const borderOrPortId = String(input?.borderOrPortId || "").trim();
    if (!borderOrPortId) return { ok: false, error: "invalid_customs_clearance" };

    const clearance = {
      clearanceId: randomUUID(),
      movementId,
      borderOrPortId,
      status: "pending",
      outcomeTag: "",
      updatedAt: new Date().toISOString(),
    };
    this.#clearances.set(clearance.clearanceId, clearance);
    return { ok: true, clearance: { ...clearance } };
  }

  decideCustomsClearance(clearanceId, input) {
    const clearance = this.#clearances.get(clearanceId);
    if (!clearance) return { ok: false, error: "customs_clearance_not_found" };
    const status = String(input?.status || "").trim();
    if (!["cleared", "held", "rejected"].includes(status))
      return { ok: false, error: "invalid_customs_clearance_state" };

    clearance.status = status;
    clearance.outcomeTag = String(input?.outcomeTag || status).slice(0, 80);
    clearance.updatedAt = new Date().toISOString();

    const movement = this.#movements.get(clearance.movementId);
    if (movement && status === "held") movement.status = "held";
    return { ok: true, clearance: { ...clearance } };
  }

  updateFuelDependency(networkId, input) {
    const id = String(networkId || "").trim();
    if (!id) return { ok: false, error: "invalid_logistics_network" };

    const fuelAvailability01 = Math.max(0, Math.min(1, Number(input?.fuelAvailability01) || 0));
    const state = {
      networkId: id,
      fuelAvailability01,
      roadCapacityMultiplier: Math.max(0.2, fuelAvailability01),
      courierCapacityMultiplier: Math.max(0.35, fuelAvailability01),
      updatedAt: new Date().toISOString(),
    };
    this.#fuelNetworks.set(id, state);
    return { ok: true, fuelDependency: { ...state } };
  }
}
