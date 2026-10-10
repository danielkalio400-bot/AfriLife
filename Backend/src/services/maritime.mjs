import { randomUUID } from "node:crypto";

const COUNTRIES = new Set(["Nigeria", "Ghana"]);
const VESSEL_TYPES = new Set([
  "passenger-ship",
  "ferry",
  "boat",
  "yacht",
  "cargo-ship",
  "oil-tanker",
]);
const VOYAGE_STATUSES = new Set([
  "scheduled",
  "boarding",
  "departed",
  "arrived",
  "delayed",
  "cancelled",
]);

export class MaritimeService {
  #ports = new Map();
  #vessels = new Map();
  #routes = new Map();
  #voyages = new Map();
  #crew = new Map();
  #maintenance = new Map();
  #weather = new Map();
  #cargo = new Map();
  #fees = new Map();
  #trade = new Map();

  registerPort(input) {
    const countryId = String(input?.countryId || "").trim();
    const cityId = String(input?.cityId || "").trim();
    const displayName = String(input?.displayName || "").trim().slice(0, 120);
    if (!COUNTRIES.has(countryId) || !cityId || !displayName)
      return { ok: false, error: "invalid_port" };

    const port = {
      portId: String(input?.portId || randomUUID()),
      countryId,
      cityId,
      displayName,
      berthCapacity: Math.max(1, Math.trunc(Number(input?.berthCapacity) || 1)),
      passengerTerminal: input?.passengerTerminal !== false,
      cargoTerminal: input?.cargoTerminal !== false,
      open: input?.open !== false,
    };
    this.#ports.set(port.portId, port);
    return { ok: true, port: { ...port } };
  }

  registerVessel(input) {
    const type = String(input?.type || "").trim();
    const homePortId = String(input?.homePortId || "").trim();
    if (!VESSEL_TYPES.has(type) || !this.#ports.has(homePortId))
      return { ok: false, error: "invalid_vessel" };

    const vessel = {
      vesselId: String(input?.vesselId || randomUUID()),
      displayName: String(input?.displayName || "Vessel").trim().slice(0, 80),
      type,
      passengerCapacity: Math.max(0, Math.trunc(Number(input?.passengerCapacity) || 0)),
      cargoCapacityKg: Math.max(0, Number(input?.cargoCapacityKg) || 0),
      fuelLevel01: Math.max(0, Math.min(1, Number(input?.fuelLevel01) || 1)),
      condition01: Math.max(0, Math.min(1, Number(input?.condition01) || 1)),
      homePortId,
      inService: input?.inService !== false,
    };
    this.#vessels.set(vessel.vesselId, vessel);
    return { ok: true, vessel: { ...vessel } };
  }

  createRoute(input) {
    const originPortId = String(input?.originPortId || "").trim();
    const destinationPortId = String(input?.destinationPortId || "").trim();
    if (!this.#ports.has(originPortId) || !this.#ports.has(destinationPortId) || originPortId === destinationPortId)
      return { ok: false, error: "invalid_maritime_route" };

    const route = {
      routeId: String(input?.routeId || randomUUID()),
      originPortId,
      destinationPortId,
      distanceKilometers: Math.max(1, Number(input?.distanceKilometers) || 1),
      passengerAllowed: input?.passengerAllowed !== false,
      cargoAllowed: input?.cargoAllowed !== false,
    };
    this.#routes.set(route.routeId, route);
    return { ok: true, route: { ...route } };
  }

  scheduleVoyage(input) {
    const route = this.#routes.get(String(input?.routeId || ""));
    const vessel = this.#vessels.get(String(input?.vesselId || ""));
    if (!route) return { ok: false, error: "maritime_route_not_found" };
    if (!vessel) return { ok: false, error: "vessel_not_found" };
    if (!vessel.inService || vessel.condition01 <= 0.2 || vessel.fuelLevel01 <= 0.05)
      return { ok: false, error: "vessel_unavailable" };

    const departure = Date.parse(String(input?.scheduledDeparture || ""));
    const arrival = Date.parse(String(input?.scheduledArrival || ""));
    if (!Number.isFinite(departure) || !Number.isFinite(arrival) || arrival <= departure)
      return { ok: false, error: "invalid_voyage_schedule" };

    const voyage = {
      voyageId: String(input?.voyageId || randomUUID()),
      routeId: route.routeId,
      vesselId: vessel.vesselId,
      status: "scheduled",
      scheduledDeparture: new Date(departure).toISOString(),
      scheduledArrival: new Date(arrival).toISOString(),
      weatherStateId: "",
    };
    this.#voyages.set(voyage.voyageId, voyage);
    return { ok: true, voyage: { ...voyage } };
  }

  setVoyageStatus(voyageId, status) {
    const voyage = this.#voyages.get(voyageId);
    if (!voyage) return { ok: false, error: "voyage_not_found" };
    if (!VOYAGE_STATUSES.has(status)) return { ok: false, error: "invalid_voyage_status" };
    voyage.status = status;
    return { ok: true, voyage: { ...voyage } };
  }

  assignCrew(voyageId, input) {
    if (!this.#voyages.has(voyageId)) return { ok: false, error: "voyage_not_found" };
    const personEntityId = String(input?.personEntityId || "").trim();
    const role = String(input?.role || "").trim();
    if (!personEntityId || !["captain", "crew"].includes(role))
      return { ok: false, error: "invalid_maritime_crew_assignment" };

    const assignment = {
      assignmentId: randomUUID(),
      voyageId,
      personEntityId,
      role,
      active: true,
    };
    this.#crew.set(assignment.assignmentId, assignment);
    return { ok: true, assignment: { ...assignment } };
  }

  updateFuel(vesselId, fuelLevel01) {
    const vessel = this.#vessels.get(vesselId);
    if (!vessel) return { ok: false, error: "vessel_not_found" };
    vessel.fuelLevel01 = Math.max(0, Math.min(1, Number(fuelLevel01) || 0));
    return {
      ok: true,
      fuel: {
        vesselId,
        fuelLevel01: vessel.fuelLevel01,
        fuelCategory: "marine-fuel",
        updatedAt: new Date().toISOString(),
      },
    };
  }

  scheduleMaintenance(vesselId, input) {
    const vessel = this.#vessels.get(vesselId);
    if (!vessel) return { ok: false, error: "vessel_not_found" };

    vessel.inService = false;
    const maintenance = {
      maintenanceId: randomUUID(),
      vesselId,
      maintenanceTag: String(input?.maintenanceTag || "routine").slice(0, 80),
      status: "scheduled",
      scheduledAt: input?.scheduledAt ? String(input.scheduledAt) : new Date().toISOString(),
      completedAt: null,
    };
    this.#maintenance.set(maintenance.maintenanceId, maintenance);
    return { ok: true, maintenance: { ...maintenance } };
  }

  completeMaintenance(maintenanceId) {
    const maintenance = this.#maintenance.get(maintenanceId);
    if (!maintenance) return { ok: false, error: "maintenance_not_found" };
    maintenance.status = "completed";
    maintenance.completedAt = new Date().toISOString();

    const vessel = this.#vessels.get(maintenance.vesselId);
    if (vessel) {
      vessel.condition01 = Math.max(vessel.condition01, 0.9);
      vessel.inService = true;
    }
    return { ok: true, maintenance: { ...maintenance } };
  }

  updateWeather(routeId, input) {
    if (!this.#routes.has(routeId)) return { ok: false, error: "maritime_route_not_found" };
    const state = {
      weatherStateId: randomUUID(),
      routeId,
      conditionTag: String(input?.conditionTag || "clear").slice(0, 80),
      disruptionLevel01: Math.max(0, Math.min(1, Number(input?.disruptionLevel01) || 0)),
      updatedAt: new Date().toISOString(),
    };
    this.#weather.set(state.weatherStateId, state);
    return { ok: true, weather: { ...state } };
  }

  linkWeatherToVoyage(voyageId, weatherStateId) {
    const voyage = this.#voyages.get(voyageId);
    const weather = this.#weather.get(weatherStateId);
    if (!voyage) return { ok: false, error: "voyage_not_found" };
    if (!weather || weather.routeId !== voyage.routeId)
      return { ok: false, error: "weather_state_not_applicable" };

    voyage.weatherStateId = weatherStateId;
    if (weather.disruptionLevel01 >= 0.8) voyage.status = "delayed";
    return { ok: true, voyage: { ...voyage } };
  }

  addCargo(voyageId, input) {
    const voyage = this.#voyages.get(voyageId);
    if (!voyage) return { ok: false, error: "voyage_not_found" };

    const vessel = this.#vessels.get(voyage.vesselId);
    const route = this.#routes.get(voyage.routeId);
    if (!route?.cargoAllowed || vessel?.cargoCapacityKg <= 0)
      return { ok: false, error: "cargo_not_supported" };

    const cargo = {
      cargoId: randomUUID(),
      voyageId,
      categoryTag: String(input?.categoryTag || "general").slice(0, 80),
      weightKilograms: Math.max(0, Number(input?.weightKilograms) || 0),
      status: "booked",
    };
    if (cargo.weightKilograms > vessel.cargoCapacityKg)
      return { ok: false, error: "cargo_capacity_exceeded" };

    this.#cargo.set(cargo.cargoId, cargo);
    return { ok: true, cargo: { ...cargo } };
  }

  createPortFee(voyageId, input) {
    const voyage = this.#voyages.get(voyageId);
    if (!voyage) return { ok: false, error: "voyage_not_found" };
    const route = this.#routes.get(voyage.routeId);
    const portId = String(input?.portId || route?.originPortId || "").trim();
    if (!this.#ports.has(portId)) return { ok: false, error: "port_not_found" };

    const fee = {
      feeId: randomUUID(),
      portId,
      voyageId,
      currency: ["NGN", "GHS"].includes(input?.currency) ? input.currency : "NGN",
      amountMinorUnits: Math.max(0, Math.trunc(Number(input?.amountMinorUnits) || 0)),
      feeType: String(input?.feeType || "port-service").slice(0, 64),
      paid: Boolean(input?.paid),
    };
    this.#fees.set(fee.feeId, fee);
    return { ok: true, fee: { ...fee } };
  }

  recordTrade(voyageId, input) {
    const voyage = this.#voyages.get(voyageId);
    if (!voyage) return { ok: false, error: "voyage_not_found" };
    const route = this.#routes.get(voyage.routeId);
    const origin = this.#ports.get(route.originPortId);
    const destination = this.#ports.get(route.destinationPortId);

    const trade = {
      tradeRecordId: randomUUID(),
      voyageId,
      originCountryId: origin.countryId,
      destinationCountryId: destination.countryId,
      cargoCategory: String(input?.cargoCategory || "general").slice(0, 80),
      cargoWeightKilograms: Math.max(0, Number(input?.cargoWeightKilograms) || 0),
      recordedAt: new Date().toISOString(),
    };
    this.#trade.set(trade.tradeRecordId, trade);
    return { ok: true, trade: { ...trade } };
  }
}
