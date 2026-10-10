import { randomUUID } from "node:crypto";

const FACILITY_TYPES = new Set([
  "clinic",
  "hospital",
  "emergency-department",
  "pharmacy",
  "laboratory",
  "imaging-center",
  "rehabilitation-center",
  "maternity-center",
  "blood-service-center",
  "mortuary",
]);

export class HealthcareService {
  #facilities = new Map();
  #visits = new Map();
  #ambulances = new Map();
  #shipments = new Map();

  registerFacility(input) {
    const displayName = String(input?.displayName || "").trim().slice(0, 120);
    const countryId = String(input?.countryId || "").trim();
    const cityId = String(input?.cityId || "").trim();
    const type = String(input?.type || "").trim();

    if (!displayName || !cityId || !["Nigeria", "Ghana"].includes(countryId) || !FACILITY_TYPES.has(type))
      return { ok: false, error: "invalid_healthcare_facility" };

    const facility = {
      facilityId: String(input?.facilityId || randomUUID()),
      displayName,
      countryId,
      cityId,
      neighborhoodId: String(input?.neighborhoodId || "").trim(),
      type,
      capacity: Math.max(0, Math.trunc(Number(input?.capacity) || 0)),
      occupancy: 0,
      gridPowerAvailability01: 1,
      backupPowerAvailability01: 1,
      medicalSupplyAvailability01: 1,
      staffRequired: Math.max(0, Math.trunc(Number(input?.staffRequired) || 0)),
      staffPresent: Math.max(0, Math.trunc(Number(input?.staffPresent) || 0)),
      open: input?.open !== false,
    };
    this.#facilities.set(facility.facilityId, facility);
    return { ok: true, facility: { ...facility } };
  }

  getFacility(facilityId) {
    const facility = this.#facilities.get(facilityId);
    return facility ? { ...facility } : null;
  }

  effectiveCapacity01(facilityId) {
    const facility = this.#facilities.get(facilityId);
    if (!facility || !facility.open || facility.capacity <= 0) return 0;

    const staffing = facility.staffRequired <= 0
      ? 1
      : Math.max(0, Math.min(1, facility.staffPresent / facility.staffRequired));
    const power = Math.max(
      Math.max(0, Math.min(1, facility.gridPowerAvailability01)),
      Math.max(0, Math.min(1, facility.backupPowerAvailability01))
    );
    const supplies = Math.max(0, Math.min(1, facility.medicalSupplyAvailability01));
    return Math.max(0, Math.min(1, Math.min(staffing, power, supplies)));
  }

  updateOperations(facilityId, input) {
    const facility = this.#facilities.get(facilityId);
    if (!facility) return { ok: false, error: "healthcare_facility_not_found" };

    for (const field of ["gridPowerAvailability01", "backupPowerAvailability01", "medicalSupplyAvailability01"]) {
      if (input?.[field] !== undefined)
        facility[field] = Math.max(0, Math.min(1, Number(input[field]) || 0));
    }
    if (input?.staffRequired !== undefined) facility.staffRequired = Math.max(0, Math.trunc(Number(input.staffRequired) || 0));
    if (input?.staffPresent !== undefined) facility.staffPresent = Math.max(0, Math.trunc(Number(input.staffPresent) || 0));
    if (input?.open !== undefined) facility.open = Boolean(input.open);

    return {
      ok: true,
      facility: { ...facility },
      effectiveCapacity01: this.effectiveCapacity01(facilityId),
    };
  }

  createVisit(input) {
    const facility = this.#facilities.get(String(input?.facilityId || ""));
    if (!facility) return { ok: false, error: "healthcare_facility_not_found" };
    if (!facility.open || facility.occupancy >= facility.capacity || this.effectiveCapacity01(facility.facilityId) <= 0.15)
      return { ok: false, error: "healthcare_facility_unavailable" };

    const patientEntityId = String(input?.patientEntityId || "").trim();
    if (!patientEntityId) return { ok: false, error: "invalid_patient" };

    const visit = {
      visitId: randomUUID(),
      patientEntityId,
      facilityId: facility.facilityId,
      carePath: String(input?.carePath || "outpatient").trim(),
      priority: String(input?.priority || "minor").trim(),
      status: "waiting",
      arrivedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    facility.occupancy++;
    this.#visits.set(visit.visitId, visit);
    return { ok: true, visit: { ...visit } };
  }

  updateVisit(visitId, status) {
    const visit = this.#visits.get(visitId);
    if (!visit) return { ok: false, error: "visit_not_found" };

    const allowed = new Set(["waiting", "in-care", "diagnostics", "admitted", "discharged", "transferred", "completed"]);
    if (!allowed.has(status)) return { ok: false, error: "invalid_visit_status" };

    const terminal = new Set(["discharged", "transferred", "completed"]);
    const wasTerminal = terminal.has(visit.status);
    visit.status = status;
    visit.updatedAt = new Date().toISOString();

    if (!wasTerminal && terminal.has(status)) {
      const facility = this.#facilities.get(visit.facilityId);
      if (facility) facility.occupancy = Math.max(0, facility.occupancy - 1);
    }
    return { ok: true, visit: { ...visit } };
  }

  registerAmbulance(input) {
    const ambulanceId = String(input?.ambulanceId || randomUUID());
    const homeFacilityId = String(input?.homeFacilityId || "").trim();
    if (!homeFacilityId || !this.#facilities.has(homeFacilityId))
      return { ok: false, error: "invalid_ambulance_home_facility" };

    const unit = {
      ambulanceId,
      homeFacilityId,
      state: "available",
      assignedVisitId: "",
      fuelLevel01: 1,
      condition01: 1,
    };
    this.#ambulances.set(ambulanceId, unit);
    return { ok: true, ambulance: { ...unit } };
  }

  dispatchAmbulance(ambulanceId, visitId) {
    const unit = this.#ambulances.get(ambulanceId);
    if (!unit) return { ok: false, error: "ambulance_not_found" };
    if (!this.#visits.has(visitId)) return { ok: false, error: "visit_not_found" };
    if (unit.state !== "available" || unit.fuelLevel01 <= 0.05 || unit.condition01 <= 0.2)
      return { ok: false, error: "ambulance_unavailable" };

    unit.state = "assigned";
    unit.assignedVisitId = visitId;
    return { ok: true, ambulance: { ...unit } };
  }

  createSupplyShipment(input) {
    const destinationFacilityId = String(input?.destinationFacilityId || "").trim();
    if (!this.#facilities.has(destinationFacilityId))
      return { ok: false, error: "healthcare_facility_not_found" };

    const shipment = {
      shipmentId: randomUUID(),
      supplierBusinessId: String(input?.supplierBusinessId || "").trim(),
      destinationFacilityId,
      supplyCategory: String(input?.supplyCategory || "general").trim().slice(0, 64),
      quantity: Math.max(0, Math.trunc(Number(input?.quantity) || 0)),
      status: "pending",
      expectedAt: input?.expectedAt ? String(input.expectedAt) : null,
    };
    this.#shipments.set(shipment.shipmentId, shipment);
    return { ok: true, shipment: { ...shipment } };
  }
}
