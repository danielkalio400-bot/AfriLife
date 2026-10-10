import test from "node:test";
import assert from "node:assert/strict";
import { NewsMediaService } from "../src/services/news-media.mjs";
import { newsMediaRuntime } from "../src/news-media-contracts.mjs";

test("Phase 39 contract contains all media and news systems from the master specification", () => {
  for (const system of [
    "radio",
    "tv",
    "newspapers",
    "social-feeds",
    "emergency-alerts",
    "breaking-news",
    "government-announcements",
    "election-coverage",
    "fuel-shortages",
    "blackouts",
    "accidents",
    "crime",
    "war",
    "peace-talks",
    "currency-news",
  ]) {
    assert.ok(newsMediaRuntime.systems.includes(system));
  }
});

test("fictional outlet can publish and filter topic feed", () => {
  const service = new NewsMediaService();
  const outlet = service.registerOutlet({
    countryId: "Nigeria",
    displayName: "AfriLife Metro Radio",
    channelType: "radio",
  });
  assert.equal(outlet.ok, true);
  assert.equal(outlet.outlet.fictional, true);

  const published = service.publish({
    outletId: outlet.outlet.outletId,
    topic: "fuel-shortage",
    headlineTag: "fictional-fuel-supply-update",
    summaryTag: "game-world-only",
    regionId: "Lagos",
    urgency: 2,
  });
  assert.equal(published.ok, true);
  assert.equal(service.feed({ countryId: "Nigeria", topic: "fuel-shortage" }).length, 1);
});

test("emergency alerts are ordered by severity and can be resolved", () => {
  const service = new NewsMediaService();
  const low = service.createEmergencyAlert({
    countryId: "Ghana",
    regionId: "Accra",
    alertType: "weather",
    messageTag: "fictional-weather-advisory",
    severity: 1,
  });
  const high = service.createEmergencyAlert({
    countryId: "Ghana",
    regionId: "Accra",
    alertType: "blackout",
    messageTag: "fictional-grid-alert",
    severity: 4,
  });

  const alerts = service.activeAlerts("Ghana", "Accra");
  assert.equal(alerts[0].alertId, high.alert.alertId);
  assert.equal(service.resolveAlert(high.alert.alertId).ok, true);
  assert.equal(service.activeAlerts("Ghana", "Accra").length, 1);
  assert.equal(service.resolveAlert(low.alert.alertId).ok, true);
});

test("news contract requires fictional, neutral and non-graphic reporting", () => {
  assert.match(newsMediaRuntime.designRule, /fictional in-world reporting/i);
  assert.match(newsMediaRuntime.designRule, /Political coverage is neutral/i);
  assert.match(newsMediaRuntime.designRule, /non-graphic/i);
});
