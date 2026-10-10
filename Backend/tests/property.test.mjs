import test from "node:test";
import assert from "node:assert/strict";
import { RealEstateService } from "../src/services/real-estate.mjs";
import { ConstructionService } from "../src/services/construction.mjs";
import { realEstateRuntime, constructionRuntime } from "../src/property-contracts.mjs";

test("real-estate contract covers Phase 23 ownership, rent, mortgages and value", () => {
  assert.ok(realEstateRuntime.systems.includes("land-purchase"));
  assert.ok(realEstateRuntime.systems.includes("rent"));
  assert.ok(realEstateRuntime.systems.includes("mortgages"));
  assert.ok(realEstateRuntime.systems.includes("neighborhood-value"));
});

test("property can be registered, rented, mortgaged and revalued", () => {
  const service = new RealEstateService();
  const created = service.registerProperty({
    ownerEntityId: "owner-1",
    countryId: "Nigeria",
    cityId: "Lagos",
    neighborhoodId: "district-1",
    type: "apartment",
    purchasePriceMinorUnits: 1000000,
  });
  assert.equal(created.ok, true);

  assert.equal(service.createRental({
    propertyId: created.property.propertyId,
    tenantEntityId: "tenant-1",
    rentPerPeriodMinorUnits: 50000,
  }).ok, true);

  assert.equal(service.createMortgage({
    propertyId: created.property.propertyId,
    borrowerEntityId: "owner-1",
    bankId: "bank-1",
    principalMinorUnits: 700000,
  }).ok, true);

  const valued = service.value(created.property.propertyId, {
    baseValueMinorUnits: 1000000,
    neighborhoodValueIndex01: 0.8,
    condition01: 0.9,
  });
  assert.equal(valued.ok, true);
  assert.ok(valued.property.estimatedValueMinorUnits > 0);
});

test("construction advances only with workers and delivered materials", () => {
  const service = new ConstructionService();
  const created = service.createProject({
    propertyId: "property-1",
    ownerEntityId: "owner-1",
    budgetMinorUnits: 10000000,
  });
  assert.equal(created.ok, true);

  assert.equal(service.advance(created.project.projectId, 10).error, "construction_workers_missing");

  service.assignWorker(created.project.projectId, {
    npcId: "npc-builder",
    role: "contractor",
    skill01: 0.9,
  });
  service.addMaterial(created.project.projectId, {
    materialId: "material-basic",
    requiredUnits: 10,
    deliveredUnits: 10,
  });

  const advanced = service.advance(created.project.projectId, 20);
  assert.equal(advanced.ok, true);
  assert.ok(advanced.project.phaseProgress01 > 0 || advanced.project.phase !== "planning");
});

test("house design proposal is explicitly concept-only and review-bound", () => {
  const service = new ConstructionService();
  const result = service.proposeHouseDesign({
    maximumFloorAreaSquareMeters: 160,
    bedroomCount: 3,
    bathroomCount: 2,
    floorCount: 1,
    budgetMinorUnits: 5000000,
  });

  assert.equal(result.ok, true);
  assert.equal(result.proposal.requiresProfessionalReview, true);
  assert.ok(result.proposal.notes.includes("in-game-concept-only"));
  assert.ok(constructionRuntime.systems.includes("ai-assisted-house-design"));
});
