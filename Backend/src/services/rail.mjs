import { randomUUID } from "node:crypto";

const COUNTRIES = new Set(["Nigeria", "Ghana"]);
const TRAIN_TYPES = new Set(["passenger", "freight"]);
const SCHEDULE_STATES = new Set(["scheduled", "boarding", "departed", "arrived", "delayed", "cancelled"]);

export class RailService {
  #stations = new Map();
  #trains = new Map();
  #routes = new Map();
  #schedules = new Map();
  #tickets = new Map();
  #crew = new Map();
  #depots = new Map();
  #repairs = new Map();
  #crossings = new Map();
  #delays = new Map();

  registerStation(input) {
    const countryId = String(input?.countryId || "").trim();
    const cityId = String(input?.cityId || "").trim();
    const displayName = String(input?.displayName || "").trim().slice(0, 120);
    if (!COUNTRIES.has(countryId) || !cityId || !displayName)
      return { ok: false, error: "invalid_rail_station" };

    const station = {
      stationId: String(input?.stationId || randomUUID()),
      countryId,
      cityId,
      displayName,
      platformCount: Math.max(1, Math.trunc(Number(input?.platformCount) || 1)),
      passengerService: input?.passengerService !== false,
      freightService: Boolean(input?.freightService),
      open: input?.open !== false,
    };
    this.#stations.set(station.stationId, station);
    return { ok: true, station: { ...station } };
  }

  registerDepot(input) {
    const countryId = String(input?.countryId || "").trim();
    const cityId = String(input?.cityId || "").trim();
    if (!COUNTRIES.has(countryId) || !cityId)
      return { ok: false, error: "invalid_rail_depot" };

    const depot = {
      depotId: String(input?.depotId || randomUUID()),
      countryId,
      cityId,
      capacity: Math.max(1, Math.trunc(Number(input?.capacity) || 1)),
      occupied: 0,
      repairFacility: input?.repairFacility !== false,
    };
    this.#depots.set(depot.depotId, depot);
    return { ok: true, depot: { ...depot } };
  }

  registerTrain(input) {
    const type = String(input?.type || "").trim();
    const depotId = String(input?.depotId || "").trim();
    if (!TRAIN_TYPES.has(type) || !this.#depots.has(depotId))
      return { ok: false, error: "invalid_train" };

    const train = {
      trainId: String(input?.trainId || randomUUID()),
      displayName: String(input?.displayName || "Train").trim().slice(0, 80),
      type,
      passengerCapacity: Math.max(0, Math.trunc(Number(input?.passengerCapacity) || 0)),
      freightCapacityKg: Math.max(0, Number(input?.freightCapacityKg) || 0),
      condition01: Math.max(0, Math.min(1, Number(input?.condition01) || 1)),
      depotId,
      inService: input?.inService !== false,
    };
    this.#trains.set(train.trainId, train);
    return { ok: true, train: { ...train } };
  }

  createRoute(input) {
    const originStationId = String(input?.originStationId || "").trim();
    const destinationStationId = String(input?.destinationStationId || "").trim();
    if (!this.#stations.has(originStationId) || !this.#stations.has(destinationStationId) ||
        originStationId === destinationStationId)
      return { ok: false, error: "invalid_rail_route" };

    const route = {
      routeId: String(input?.routeId || randomUUID()),
      originStationId,
      destinationStationId,
      distanceKilometers: Math.max(1, Number(input?.distanceKilometers) || 1),
      passengerAllowed: input?.passengerAllowed !== false,
      freightAllowed: input?.freightAllowed !== false,
    };
    this.#routes.set(route.routeId, route);
    return { ok: true, route: { ...route } };
  }

  scheduleService(input) {
    const route = this.#routes.get(String(input?.routeId || ""));
    const train = this.#trains.get(String(input?.trainId || ""));
    if (!route) return { ok: false, error: "rail_route_not_found" };
    if (!train) return { ok: false, error: "train_not_found" };
    if (!train.inService || train.condition01 <= 0.2)
      return { ok: false, error: "train_unavailable" };
    if (train.type === "passenger" && !route.passengerAllowed)
      return { ok: false, error: "passenger_service_not_allowed" };
    if (train.type === "freight" && !route.freightAllowed)
      return { ok: false, error: "freight_service_not_allowed" };

    const departure = Date.parse(String(input?.scheduledDeparture || ""));
    const arrival = Date.parse(String(input?.scheduledArrival || ""));
    if (!Number.isFinite(departure) || !Number.isFinite(arrival) || arrival <= departure)
      return { ok: false, error: "invalid_rail_schedule" };

    const schedule = {
      scheduleId: String(input?.scheduleId || randomUUID()),
      routeId: route.routeId,
      trainId: train.trainId,
      scheduledDeparture: new Date(departure).toISOString(),
      scheduledArrival: new Date(arrival).toISOString(),
      status: "scheduled",
    };
    this.#schedules.set(schedule.scheduleId, schedule);
    return { ok: true, schedule: { ...schedule } };
  }

  setScheduleStatus(scheduleId, status) {
    const schedule = this.#schedules.get(scheduleId);
    if (!schedule) return { ok: false, error: "rail_schedule_not_found" };
    if (!SCHEDULE_STATES.has(status)) return { ok: false, error: "invalid_rail_schedule_status" };
    schedule.status = status;
    return { ok: true, schedule: { ...schedule } };
  }

  issueTicket(scheduleId, input) {
    const schedule = this.#schedules.get(scheduleId);
    if (!schedule) return { ok: false, error: "rail_schedule_not_found" };
    const train = this.#trains.get(schedule.trainId);
    const passengerEntityId = String(input?.passengerEntityId || "").trim();
    if (train?.type !== "passenger" || !passengerEntityId)
      return { ok: false, error: "invalid_passenger_ticket" };

    const ticket = {
      ticketId: randomUUID(),
      scheduleId,
      passengerEntityId,
      currency: ["NGN", "GHS"].includes(input?.currency) ? input.currency : "NGN",
      fareMinorUnits: Math.max(0, Math.trunc(Number(input?.fareMinorUnits) || 0)),
      valid: true,
      used: false,
    };
    this.#tickets.set(ticket.ticketId, ticket);
    return { ok: true, ticket: { ...ticket } };
  }

  useTicket(ticketId) {
    const ticket = this.#tickets.get(ticketId);
    if (!ticket) return { ok: false, error: "rail_ticket_not_found" };
    if (!ticket.valid || ticket.used) return { ok: false, error: "rail_ticket_not_usable" };
    ticket.used = true;
    return { ok: true, ticket: { ...ticket } };
  }

  assignCrew(scheduleId, input) {
    if (!this.#schedules.has(scheduleId)) return { ok: false, error: "rail_schedule_not_found" };
    const personEntityId = String(input?.personEntityId || "").trim();
    const role = String(input?.role || "").trim();
    if (!personEntityId || !["driver", "conductor"].includes(role))
      return { ok: false, error: "invalid_rail_crew_assignment" };

    const assignment = {
      assignmentId: randomUUID(),
      scheduleId,
      personEntityId,
      role,
      active: true,
    };
    this.#crew.set(assignment.assignmentId, assignment);
    return { ok: true, assignment: { ...assignment } };
  }

  scheduleRepair(trainId, input) {
    const train = this.#trains.get(trainId);
    if (!train) return { ok: false, error: "train_not_found" };
    const depotId = String(input?.depotId || train.depotId).trim();
    const depot = this.#depots.get(depotId);
    if (!depot || !depot.repairFacility)
      return { ok: false, error: "repair_depot_not_available" };

    train.inService = false;
    const repair = {
      repairId: randomUUID(),
      trainId,
      depotId,
      repairTag: String(input?.repairTag || "routine").slice(0, 80),
      status: "scheduled",
      scheduledAt: input?.scheduledAt ? String(input.scheduledAt) : new Date().toISOString(),
      completedAt: null,
    };
    this.#repairs.set(repair.repairId, repair);
    return { ok: true, repair: { ...repair } };
  }

  completeRepair(repairId) {
    const repair = this.#repairs.get(repairId);
    if (!repair) return { ok: false, error: "rail_repair_not_found" };
    repair.status = "completed";
    repair.completedAt = new Date().toISOString();
    const train = this.#trains.get(repair.trainId);
    if (train) {
      train.condition01 = Math.max(train.condition01, 0.9);
      train.inService = true;
    }
    return { ok: true, repair: { ...repair } };
  }

  registerCrossing(input) {
    const routeId = String(input?.routeId || "").trim();
    if (!this.#routes.has(routeId)) return { ok: false, error: "rail_route_not_found" };

    const crossing = {
      crossingId: String(input?.crossingId || randomUUID()),
      routeId,
      locationTag: String(input?.locationTag || "").slice(0, 120),
      openToRoadTraffic: input?.openToRoadTraffic !== false,
      status: "normal",
    };
    this.#crossings.set(crossing.crossingId, crossing);
    return { ok: true, crossing: { ...crossing } };
  }

  setCrossingState(crossingId, input) {
    const crossing = this.#crossings.get(crossingId);
    if (!crossing) return { ok: false, error: "rail_crossing_not_found" };
    crossing.openToRoadTraffic = Boolean(input?.openToRoadTraffic);
    crossing.status = String(input?.status || "normal").slice(0, 40);
    return { ok: true, crossing: { ...crossing } };
  }

  delay(scheduleId, input) {
    const schedule = this.#schedules.get(scheduleId);
    if (!schedule) return { ok: false, error: "rail_schedule_not_found" };
    const delay = {
      delayId: randomUUID(),
      scheduleId,
      reasonTag: String(input?.reasonTag || "operational").slice(0, 80),
      delayMinutes: Math.max(1, Math.trunc(Number(input?.delayMinutes) || 1)),
      resolved: false,
    };
    this.#delays.set(delay.delayId, delay);
    schedule.status = "delayed";
    return { ok: true, delay: { ...delay }, schedule: { ...schedule } };
  }
}
