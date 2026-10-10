import test from "node:test";
import assert from "node:assert/strict";
import { EnvironmentalResponseService } from "../src/services/environmental-response.mjs";
import { WeatherEnvironmentService } from "../src/services/weather-environment.mjs";
import { NewsMediaService } from "../src/services/news-media.mjs";
import { environmentalResponseRuntime } from "../src/environmental-response-contracts.mjs";
import { makeServer } from "../src/server.mjs";

function createWorld() {
  const weather = new WeatherEnvironmentService();
  const media = new NewsMediaService();
  const response = new EnvironmentalResponseService({ weather, media });
  return { weather, media, response };
}
function storm(world, countryId, regionId, intensity = 1) {
  assert.equal(world.weather.setRegionalWeather({
    countryId, regionId, primaryCondition: "storm", season: "wet",
    stormIntensity01: intensity, windIntensity01: intensity,
    rainIntensity01: intensity, floodingIntensity01: intensity,
  }).ok, true);
}

test("reuses Phase 38 weather and separates Nigeria/Ghana state", () => {
  const world = createWorld();
  storm(world, "Nigeria", "Lagos");
  storm(world, "Ghana", "Accra", 0.85);
  const nigeria = world.response.assess("Nigeria", "Lagos");
  const ghana = world.response.assess("Ghana", "Accra");
  assert.ok(nigeria.disruption.grid > 0.75);
  assert.ok(ghana.disruption.aviation > 0.7);
  assert.equal(world.response.assess("Ghana", "Lagos"), null);
  assert.equal(world.response.assess("Benin", "Lagos"), null);
});

test("idempotency prevents duplicated disruption and news alerts", () => {
  const world = createWorld();
  storm(world, "Ghana", "Tema");
  const req = { countryId: "Ghana", regionId: "Tema", kind: "maritime", requestId: "event-1" };
  const first = world.response.open(req);
  assert.equal(first.ok, true);
  assert.equal(first.replay, false);
  assert.ok(first.incident.modifiers.maritimeCapacityMultiplier < 1);
  assert.ok(first.incident.alertId);
  assert.equal(world.media.activeAlerts("Ghana", "Tema").length, 1);
  assert.equal(world.response.open(req).replay, true);
  assert.equal(world.response.open({ ...req, requestId: "event-2" }).replay, true);
  assert.equal(world.media.activeAlerts("Ghana", "Tema").length, 1);
  assert.equal(world.response.open({ ...req, regionId: "Accra" }).error, "request_id_conflict");
  assert.equal(world.response.list().length, 1);
});

test("adverse weather slows but does not prevent eventual recovery", () => {
  const world = createWorld();
  storm(world, "Nigeria", "PortHarcourt");
  const opened = world.response.open({
    countryId: "Nigeria", regionId: "PortHarcourt", kind: "road", requestId: "r-1"
  });
  assert.ok(opened.incident.alertId);
  const id = opened.incident.incidentId;
  const first = world.response.advance({ incidentId: id, workOrderId: "crew-1", effort01: 0.7 });
  assert.equal(first.incident.status, "recovering");
  assert.ok(first.incident.recovery01 > 0 && first.incident.recovery01 < 0.7);
  assert.equal(world.response.advance({ incidentId: id, workOrderId: "crew-1", effort01: 0.7 }).replay, true);
  for (let n = 2; n < 6; n++) world.response.advance({ incidentId: id, workOrderId: "crew-" + n, effort01: 1 });
  const restored = world.response.get(id);
  assert.equal(restored.status, "restored");
  assert.equal(restored.modifiers.travelDelay01, 0);
  assert.equal(world.media.activeAlerts("Nigeria", "PortHarcourt").length, 0);
  assert.equal(world.response.advance({ incidentId: id, workOrderId: "late", effort01: 1 }).error, "already_restored");
});

test("rejects invalid and low-severity disruptions without fake environmental state", () => {
  const world = createWorld();
  assert.equal(world.response.open({ countryId: "Nigeria", regionId: "Lagos", kind: "grid", requestId: "x" }).error, "weather_state_not_found");
  world.weather.setRegionalWeather({ countryId: "Nigeria", regionId: "Lagos", primaryCondition: "clear" });
  assert.equal(world.response.open({ countryId: "Nigeria", regionId: "Lagos", kind: "grid", requestId: "x" }).error, "no_significant_disruption");
  assert.equal(world.response.open({ countryId: "Nigeria", regionId: "Lagos", kind: "unsafe", requestId: "x" }).error, "invalid_environmental_disruption");
  assert.equal(world.response.advance({ incidentId: "nonexistent", effort01: 1, workOrderId: "test" }).error, "disruption_not_found");
  assert.match(environmentalResponseRuntime.safety, /fictional/i);
});

test("development HTTP integration supports weather -> disruption -> recovery", async t => {
  const server = makeServer();
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  t.after(() => server.close());
  const base = "http://127.0.0.1:" + server.address().port;
  const weather = await fetch(base + "/v1/dev/weather/regions", {
    method:"POST", headers:{"content-type":"application/json"},
    body:JSON.stringify({countryId:"Ghana",regionId:"Kumasi",primaryCondition:"storm",stormIntensity01:1,windIntensity01:1})
  });
  assert.equal(weather.status, 200);
  const post = await fetch(base + "/v1/dev/environment/disruptions",{
    method:"POST",headers:{"content-type":"application/json"},
    body:JSON.stringify({countryId:"Ghana",regionId:"Kumasi",kind:"grid",requestId:"request-1"})
  });
  assert.equal(post.status, 200);
  const disruption = await post.json();
  assert.ok(disruption.incident.incidentId);
  const list = await fetch(base + "/v1/environment/disruptions?countryId=Ghana");
  assert.equal((await list.json()).incidents.length, 1);
  const recover = await fetch(base + "/v1/dev/environment/recovery", {
    method:"POST",headers:{"content-type":"application/json"},
    body:JSON.stringify({incidentId:disruption.incident.incidentId,workOrderId:"crew-1",effort01:0.5})
  });
  assert.equal(recover.status, 200);
});
