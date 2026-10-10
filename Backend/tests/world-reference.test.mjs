import test from "node:test";
import assert from "node:assert/strict";
import {
  nigeriaReference,
  ghanaReference,
  crossBorderReference,
  researchSources,
} from "../src/world-reference.mjs";

test("Nigeria and Ghana references preserve core country rules", () => {
  assert.equal(nigeriaReference.currency, "NGN");
  assert.equal(ghanaReference.currency, "GHS");
  assert.equal(nigeriaReference.trafficSide, "right");
  assert.equal(ghanaReference.trafficSide, "right");
  assert.ok(nigeriaReference.priorityCities.includes("PortHarcourt"));
  assert.ok(ghanaReference.priorityCities.includes("Accra"));
});

test("cross-border reference models travel and roaming", () => {
  assert.ok(crossBorderReference.systems.includes("telecom-roaming"));
  assert.ok(crossBorderReference.systems.includes("passport-and-immigration"));
});

test("research source registry names official institutions", () => {
  const ids = researchSources.sources.map(source => source.id);
  assert.ok(ids.includes("ng-nimet"));
  assert.ok(ids.includes("ng-nerc"));
  assert.ok(ids.includes("gh-nca"));
  assert.ok(ids.includes("gh-energy"));
});
