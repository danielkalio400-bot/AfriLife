import test from "node:test";
import assert from "node:assert/strict";
import { WeatherEnvironmentService } from "../src/services/weather-environment.mjs";
import { weatherEnvironmentRuntime } from "../src/weather-environment-contracts.mjs";

test("Phase 38 contract includes every weather/environment system", () => {
  for (const system of [
    "rain",
    "storms",
    "heat",
    "fog",
    "flooding",
    "wet-roads",
    "wind",
    "seasonal-weather",
    "solar-output-changes",
    "flight-disruption",
    "ship-disruption",
    "power-grid-damage",
    "agricultural-impact",
  ]) {
    assert.ok(weatherEnvironmentRuntime.systems.includes(system));
  }
});

test("rain and flooding produce wet-road and solar effects", () => {
  const service = new WeatherEnvironmentService();
  const result = service.setRegionalWeather({
    countryId: "Nigeria",
    regionId: "Lagos",
    primaryCondition: "rain",
    season: "wet",
    rainIntensity01: 0.8,
    floodingIntensity01: 0.4,
    fogIntensity01: 0.2,
  });
  assert.equal(result.ok, true);
  assert.ok(result.weather.wetRoads01 > 0.55);
  assert.ok(result.impact.solarOutputMultiplier < 1);
  assert.ok(result.impact.roadGripMultiplier < 1);
});

test("storm state can disrupt flights, ships and power grid", () => {
  const service = new WeatherEnvironmentService();
  const result = service.setRegionalWeather({
    countryId: "Ghana",
    regionId: "Accra",
    primaryCondition: "storm",
    season: "wet",
    stormIntensity01: 0.9,
    windIntensity01: 0.7,
  });
  assert.equal(result.ok, true);
  assert.ok(result.impact.flightDisruption01 > 0.5);
  assert.ok(result.impact.shipDisruption01 > 0.5);
  assert.ok(result.impact.powerGridDamageRisk01 > 0.5);
});

test("season and agricultural impact remain normalized game state", () => {
  const service = new WeatherEnvironmentService();
  const result = service.setRegionalWeather({
    countryId: "Ghana",
    regionId: "Kumasi",
    primaryCondition: "heat",
    season: "dry",
    heatIntensity01: 0.8,
  });
  assert.equal(result.ok, true);
  assert.ok(result.impact.agriculturalYieldMultiplier <= 1);
  assert.match(weatherEnvironmentRuntime.impactRule, /normalized gameplay multipliers/i);
});

test("weather events can be started and ended without live forecast claims", () => {
  const service = new WeatherEnvironmentService();
  service.setRegionalWeather({
    countryId: "Nigeria",
    regionId: "PortHarcourt",
    primaryCondition: "rain",
    season: "wet",
    rainIntensity01: 0.7,
  });
  const event = service.createEvent({
    countryId: "Nigeria",
    regionId: "PortHarcourt",
    eventType: "rain",
    severity01: 0.7,
  });
  assert.equal(event.ok, true);
  assert.equal(service.endEvent(event.event.eventId).ok, true);
  assert.match(weatherEnvironmentRuntime.designRule, /not live forecasts/i);
});
