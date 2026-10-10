import { randomUUID } from "node:crypto";

const COUNTRIES = new Set(["Nigeria", "Ghana"]);
const FLIGHT_TYPES = new Set(["commercial", "private-jet", "helicopter", "cargo"]);
const FLIGHT_STATUSES = new Set([
  "scheduled",
  "check-in-open",
  "boarding",
  "departed",
  "arrived",
  "delayed",
  "cancelled",
]);

export class AviationService {
  #airports = new Map();
  #aircraft = new Map();
  #flights = new Map();
  #checkIns = new Map();
  #baggage = new Map();
  #security = new Map();
  #boarding = new Map();
  #crew = new Map();
  #maintenance = new Map();
  #hangars = new Map();
  #cargo = new Map();
  #disruptions = new Map();

  registerAirport(input) {
    const countryId = String(input?.countryId || "").trim();
    const cityId = String(input?.cityId || "").trim();
    const displayName = String(input?.displayName || "").trim().slice(0, 120);
    if (!COUNTRIES.has(countryId) || !cityId || !displayName)
      return { ok: false, error: "invalid_airport" };

    const airport = {
      airportId: String(input?.airportId || randomUUID()),
      countryId,
      cityId,
      displayName,
      terminalCount: Math.max(1, Math.trunc(Number(input?.terminalCount) || 1)),
      gateCount: Math.max(1, Math.trunc(Number(input?.gateCount) || 1)),
      open: input?.open !== false,
    };
    this.#airports.set(airport.airportId, airport);
    return { ok: true, airport: { ...airport } };
  }

  registerAircraft(input) {
    const aircraft = {
      aircraftId: String(input?.aircraftId || randomUUID()),
      modelTag: String(input?.modelTag || "generic-aircraft").trim().slice(0, 80),
      passengerCapacity: Math.max(1, Math.trunc(Number(input?.passengerCapacity) || 1)),
      fuelLevel01: Math.max(0, Math.min(1, Number(input?.fuelLevel01) || 1)),
      condition01: Math.max(0, Math.min(1, Number(input?.condition01) || 1)),
      hangarId: String(input?.hangarId || "").trim(),
      inService: input?.inService !== false,
    };
    this.#aircraft.set(aircraft.aircraftId, aircraft);
    return { ok: true, aircraft: { ...aircraft } };
  }

  scheduleFlight(input) {
    const originAirportId = String(input?.originAirportId || "").trim();
    const destinationAirportId = String(input?.destinationAirportId || "").trim();
    const aircraftId = String(input?.aircraftId || "").trim();
    const type = String(input?.type || "commercial").trim();
    const departure = Date.parse(String(input?.scheduledDeparture || ""));
    const arrival = Date.parse(String(input?.scheduledArrival || ""));

    if (!this.#airports.has(originAirportId) || !this.#airports.has(destinationAirportId))
      return { ok: false, error: "airport_not_found" };
    if (!this.#aircraft.has(aircraftId))
      return { ok: false, error: "aircraft_not_found" };
    if (!FLIGHT_TYPES.has(type) || !Number.isFinite(departure) || !Number.isFinite(arrival) || arrival <= departure)
      return { ok: false, error: "invalid_flight_schedule" };

    const aircraft = this.#aircraft.get(aircraftId);
    if (!aircraft.inService || aircraft.condition01 <= 0.2 || aircraft.fuelLevel01 <= 0.05)
      return { ok: false, error: "aircraft_unavailable" };

    const flight = {
      flightId: String(input?.flightId || randomUUID()),
      type,
      originAirportId,
      destinationAirportId,
      aircraftId,
      status: "scheduled",
      scheduledDeparture: new Date(departure).toISOString(),
      scheduledArrival: new Date(arrival).toISOString(),
      gateId: String(input?.gateId || "").trim(),
    };
    this.#flights.set(flight.flightId, flight);
    return { ok: true, flight: { ...flight } };
  }

  setFlightStatus(flightId, status) {
    const flight = this.#flights.get(flightId);
    if (!flight) return { ok: false, error: "flight_not_found" };
    if (!FLIGHT_STATUSES.has(status)) return { ok: false, error: "invalid_flight_status" };
    flight.status = status;
    return { ok: true, flight: { ...flight } };
  }

  checkIn(input) {
    const flight = this.#flights.get(String(input?.flightId || ""));
    const passengerEntityId = String(input?.passengerEntityId || "").trim();
    if (!flight) return { ok: false, error: "flight_not_found" };
    if (!passengerEntityId) return { ok: false, error: "invalid_passenger" };
    if (!["scheduled", "check-in-open", "delayed"].includes(flight.status))
      return { ok: false, error: "check_in_closed" };

    const record = {
      checkInId: randomUUID(),
      flightId: flight.flightId,
      passengerEntityId,
      travelDocumentId: String(input?.travelDocumentId || "").trim(),
      checkedIn: true,
      securityScreeningCompleted: false,
      immigrationCheckpointCompleted: false,
      boardingEligible: false,
    };
    this.#checkIns.set(record.checkInId, record);
    return { ok: true, checkIn: { ...record } };
  }

  addBaggage(checkInId, input) {
    const checkIn = this.#checkIns.get(checkInId);
    if (!checkIn) return { ok: false, error: "check_in_not_found" };

    const baggage = {
      baggageId: randomUUID(),
      flightId: checkIn.flightId,
      passengerEntityId: checkIn.passengerEntityId,
      weightKilograms: Math.max(0, Number(input?.weightKilograms) || 0),
      status: "checked",
    };
    this.#baggage.set(baggage.baggageId, baggage);
    return { ok: true, baggage: { ...baggage } };
  }

  recordSecurityScreening(checkInId, input) {
    const checkIn = this.#checkIns.get(checkInId);
    if (!checkIn) return { ok: false, error: "check_in_not_found" };

    const cleared = input?.cleared === true;
    const screening = {
      screeningId: randomUUID(),
      checkInId,
      status: "completed",
      cleared,
      outcomeTag: String(input?.outcomeTag || (cleared ? "cleared" : "review-required")).slice(0, 80),
    };
    this.#security.set(screening.screeningId, screening);
    checkIn.securityScreeningCompleted = cleared;
    this.#refreshBoardingEligibility(checkIn);
    return { ok: true, screening: { ...screening }, checkIn: { ...checkIn } };
  }

  recordImmigrationCheckpoint(checkInId, completed) {
    const checkIn = this.#checkIns.get(checkInId);
    if (!checkIn) return { ok: false, error: "check_in_not_found" };
    checkIn.immigrationCheckpointCompleted = Boolean(completed);
    this.#refreshBoardingEligibility(checkIn);
    return { ok: true, checkIn: { ...checkIn } };
  }

  board(checkInId, gateId) {
    const checkIn = this.#checkIns.get(checkInId);
    if (!checkIn) return { ok: false, error: "check_in_not_found" };
    if (!checkIn.boardingEligible) return { ok: false, error: "passenger_not_boarding_eligible" };

    const flight = this.#flights.get(checkIn.flightId);
    if (!flight || flight.status !== "boarding")
      return { ok: false, error: "flight_not_boarding" };

    const boarding = {
      boardingId: randomUUID(),
      checkInId,
      flightId: checkIn.flightId,
      gateId: String(gateId || flight.gateId || "").trim(),
      boarded: true,
      boardedAt: new Date().toISOString(),
    };
    this.#boarding.set(boarding.boardingId, boarding);
    return { ok: true, boarding: { ...boarding } };
  }

  assignCrew(flightId, input) {
    if (!this.#flights.has(flightId)) return { ok: false, error: "flight_not_found" };
    const personEntityId = String(input?.personEntityId || "").trim();
    const role = String(input?.role || "").trim();
    if (!personEntityId || !["pilot", "cabin-crew", "ground-staff"].includes(role))
      return { ok: false, error: "invalid_aviation_crew_assignment" };

    const assignment = {
      assignmentId: randomUUID(),
      flightId,
      personEntityId,
      role,
      active: true,
    };
    this.#crew.set(assignment.assignmentId, assignment);
    return { ok: true, assignment: { ...assignment } };
  }

  scheduleMaintenance(aircraftId, input) {
    const aircraft = this.#aircraft.get(aircraftId);
    if (!aircraft) return { ok: false, error: "aircraft_not_found" };

    const maintenance = {
      maintenanceId: randomUUID(),
      aircraftId,
      maintenanceTag: String(input?.maintenanceTag || "routine").slice(0, 80),
      status: "scheduled",
      scheduledAt: input?.scheduledAt ? String(input.scheduledAt) : new Date().toISOString(),
      completedAt: null,
    };
    aircraft.inService = false;
    this.#maintenance.set(maintenance.maintenanceId, maintenance);
    return { ok: true, maintenance: { ...maintenance } };
  }

  completeMaintenance(maintenanceId) {
    const maintenance = this.#maintenance.get(maintenanceId);
    if (!maintenance) return { ok: false, error: "maintenance_not_found" };
    maintenance.status = "completed";
    maintenance.completedAt = new Date().toISOString();

    const aircraft = this.#aircraft.get(maintenance.aircraftId);
    if (aircraft) {
      aircraft.condition01 = Math.max(aircraft.condition01, 0.9);
      aircraft.inService = true;
    }
    return { ok: true, maintenance: { ...maintenance } };
  }

  registerHangar(input) {
    const airportId = String(input?.airportId || "").trim();
    if (!this.#airports.has(airportId)) return { ok: false, error: "airport_not_found" };

    const hangar = {
      hangarId: String(input?.hangarId || randomUUID()),
      airportId,
      capacity: Math.max(1, Math.trunc(Number(input?.capacity) || 1)),
      occupied: 0,
    };
    this.#hangars.set(hangar.hangarId, hangar);
    return { ok: true, hangar: { ...hangar } };
  }

  addCargo(flightId, input) {
    if (!this.#flights.has(flightId)) return { ok: false, error: "flight_not_found" };
    const cargo = {
      cargoId: randomUUID(),
      flightId,
      categoryTag: String(input?.categoryTag || "general").slice(0, 80),
      weightKilograms: Math.max(0, Number(input?.weightKilograms) || 0),
      status: "booked",
    };
    this.#cargo.set(cargo.cargoId, cargo);
    return { ok: true, cargo: { ...cargo } };
  }

  disruptFlight(flightId, input) {
    const flight = this.#flights.get(flightId);
    if (!flight) return { ok: false, error: "flight_not_found" };

    const type = String(input?.type || "delay");
    if (!["delay", "cancellation"].includes(type))
      return { ok: false, error: "invalid_flight_disruption" };

    const disruption = {
      disruptionId: randomUUID(),
      flightId,
      type,
      reasonTag: String(input?.reasonTag || "operational").slice(0, 80),
      delayMinutes: type === "delay" ? Math.max(1, Math.trunc(Number(input?.delayMinutes) || 1)) : 0,
      resolved: false,
    };
    this.#disruptions.set(disruption.disruptionId, disruption);
    flight.status = type === "delay" ? "delayed" : "cancelled";
    return { ok: true, disruption: { ...disruption }, flight: { ...flight } };
  }

  #refreshBoardingEligibility(checkIn) {
    checkIn.boardingEligible =
      checkIn.checkedIn &&
      checkIn.securityScreeningCompleted &&
      checkIn.immigrationCheckpointCompleted;
  }
}
