import test from "node:test";
import assert from "node:assert/strict";
import { HealthcareService } from "../src/services/healthcare.mjs";
import { healthcareRuntime } from "../src/health-contracts.mjs";

test("Phase 24 contract preserves the master healthcare systems", () => {
  for (const system of [
    "clinics",
    "hospitals",
    "emergency-departments",
    "ambulances",
    "pharmacies",
    "labs",
    "imaging",
    "wards",
    "surgery-high-level",
    "rehabilitation",
    "maternity",
    "blood-services",
    "mortuary",
    "hospital-power-backup",
    "staffing",
    "medical-supply-chains",
  ]) {
    assert.ok(healthcareRuntime.systems.includes(system));
  }
});

test("facility operating capacity depends on staffing, power and supplies", () => {
  const service = new HealthcareService();
  const created = service.registerFacility({
    displayName: "Example Hospital",
    countryId: "Nigeria",
    cityId: "Lagos",
    type: "hospital",
    capacity: 100,
    staffRequired: 50,
    staffPresent: 25,
  });
  assert.equal(created.ok, true);
  assert.equal(service.effectiveCapacity01(created.facility.facilityId), 0.5);

  const updated = service.updateOperations(created.facility.facilityId, {
    gridPowerAvailability01: 0.1,
    backupPowerAvailability01: 0.8,
    medicalSupplyAvailability01: 0.6,
  });
  assert.equal(updated.ok, true);
  assert.equal(updated.effectiveCapacity01, 0.5);
});

test("patient visits consume and release facility capacity", () => {
  const service = new HealthcareService();
  const facility = service.registerFacility({
    displayName: "Example Clinic",
    countryId: "Ghana",
    cityId: "Accra",
    type: "clinic",
    capacity: 2,
    staffRequired: 1,
    staffPresent: 1,
  });

  const visit = service.createVisit({
    patientEntityId: "npc-1",
    facilityId: facility.facility.facilityId,
    carePath: "outpatient",
    priority: "moderate",
  });
  assert.equal(visit.ok, true);
  assert.equal(service.getFacility(facility.facility.facilityId).occupancy, 1);

  assert.equal(service.updateVisit(visit.visit.visitId, "completed").ok, true);
  assert.equal(service.getFacility(facility.facility.facilityId).occupancy, 0);
});

test("ambulance dispatch requires a valid visit and available unit", () => {
  const service = new HealthcareService();
  const facility = service.registerFacility({
    displayName: "Example Emergency Facility",
    countryId: "Nigeria",
    cityId: "Abuja",
    type: "emergency-department",
    capacity: 10,
    staffRequired: 2,
    staffPresent: 2,
  });
  const visit = service.createVisit({
    patientEntityId: "npc-2",
    facilityId: facility.facility.facilityId,
    carePath: "emergency",
    priority: "serious",
  });
  const ambulance = service.registerAmbulance({
    homeFacilityId: facility.facility.facilityId,
  });

  assert.equal(ambulance.ok, true);
  assert.equal(service.dispatchAmbulance(ambulance.ambulance.ambulanceId, visit.visit.visitId).ok, true);
});

test("medical supply shipment targets a registered facility", () => {
  const service = new HealthcareService();
  const facility = service.registerFacility({
    displayName: "Example Pharmacy",
    countryId: "Ghana",
    cityId: "Kumasi",
    type: "pharmacy",
    capacity: 20,
  });

  const shipment = service.createSupplyShipment({
    supplierBusinessId: "supplier-1",
    destinationFacilityId: facility.facility.facilityId,
    supplyCategory: "general",
    quantity: 100,
  });
  assert.equal(shipment.ok, true);
});
