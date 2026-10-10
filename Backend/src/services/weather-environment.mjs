import { randomUUID } from "node:crypto";

const COUNTRIES = new Set(["Nigeria", "Ghana"]);
const CONDITIONS = new Set(["clear", "rain", "storm", "heat", "fog", "flooding", "wind"]);
const SEASONS = new Set(["dry", "wet", "harmattan-like", "transitional"]);

function clamp01(value) {
  return Math.max(0, Math.min(1, Number(value) || 0));
}

function clean(value, max = 100) {
  const result = String(value || "").trim();
  return result && result.length <= max ? result : "";
}

export class WeatherEnvironmentService {
  #states = new Map();
  #events = new Map();

  setRegionalWeather(input) {
    const countryId = clean(input?.countryId, 32);
    const regionId = clean(input?.regionId, 80);
    const primaryCondition = clean(input?.primaryCondition || "clear", 32);
    const season = clean(input?.season || "transitional", 32);

    if (!COUNTRIES.has(countryId) || !regionId ||
        !CONDITIONS.has(primaryCondition) || !SEASONS.has(season))
      return { ok: false, error: "invalid_weather_state" };

    const key = countryId + ":" + regionId;
    const existing = this.#states.get(key);
    const state = {
      weatherStateId: existing?.weatherStateId || randomUUID(),
      countryId,
      regionId,
      primaryCondition,
      season,
      rainIntensity01: clamp01(input?.rainIntensity01),
      stormIntensity01: clamp01(input?.stormIntensity01),
      heatIntensity01: clamp01(input?.heatIntensity01),
      fogIntensity01: clamp01(input?.fogIntensity01),
      floodingIntensity01: clamp01(input?.floodingIntensity01),
      windIntensity01: clamp01(input?.windIntensity01),
      wetRoads01: clamp01(input?.wetRoads01),
      updatedAt: new Date().toISOString(),
    };

    if (state.primaryCondition === "rain" && state.rainIntensity01 === 0) state.rainIntensity01 = 0.5;
    if (state.primaryCondition === "storm" && state.stormIntensity01 === 0) state.stormIntensity01 = 0.6;
    if (state.primaryCondition === "heat" && state.heatIntensity01 === 0) state.heatIntensity01 = 0.6;
    if (state.primaryCondition === "fog" && state.fogIntensity01 === 0) state.fogIntensity01 = 0.5;
    if (state.primaryCondition === "flooding" && state.floodingIntensity01 === 0) state.floodingIntensity01 = 0.6;
    if (state.primaryCondition === "wind" && state.windIntensity01 === 0) state.windIntensity01 = 0.5;

    state.wetRoads01 = Math.max(
      state.wetRoads01,
      state.rainIntensity01 * 0.7,
      state.floodingIntensity01
    );

    this.#states.set(key, state);
    return {
      ok: true,
      weather: { ...state },
      impact: this.#impactFor(state),
    };
  }

  getRegionalWeather(countryId, regionId) {
    const state = this.#states.get(String(countryId || "") + ":" + String(regionId || ""));
    if (!state) return null;
    return {
      weather: { ...state },
      impact: this.#impactFor(state),
    };
  }

  createEvent(input) {
    const countryId = clean(input?.countryId, 32);
    const regionId = clean(input?.regionId, 80);
    const current = this.#states.get(countryId + ":" + regionId);
    if (!current) return { ok: false, error: "weather_state_not_found" };

    const eventType = clean(input?.eventType || current.primaryCondition, 40);
    const severity01 = clamp01(input?.severity01);
    if (!CONDITIONS.has(eventType) || severity01 <= 0)
      return { ok: false, error: "invalid_weather_event" };

    const event = {
      eventId: randomUUID(),
      weatherStateId: current.weatherStateId,
      countryId,
      regionId,
      eventType,
      severity01,
      status: "active",
      startedAt: new Date().toISOString(),
      endedAt: null,
    };
    this.#events.set(event.eventId, event);
    return { ok: true, event: { ...event } };
  }

  endEvent(eventId) {
    const event = this.#events.get(String(eventId || ""));
    if (!event) return { ok: false, error: "weather_event_not_found" };
    if (event.status === "ended") return { ok: false, error: "weather_event_already_ended" };
    event.status = "ended";
    event.endedAt = new Date().toISOString();
    return { ok: true, event: { ...event } };
  }

  activeEvents(countryId = "", regionId = "") {
    return [...this.#events.values()]
      .filter(event =>
        event.status === "active" &&
        (!countryId || event.countryId === countryId) &&
        (!regionId || event.regionId === regionId)
      )
      .map(event => ({ ...event }));
  }

  #impactFor(state) {
    const rain = state.rainIntensity01;
    const storm = state.stormIntensity01;
    const heat = state.heatIntensity01;
    const fog = state.fogIntensity01;
    const flood = state.floodingIntensity01;
    const wind = state.windIntensity01;

    const solarPenalty = Math.max(rain * 0.35, storm * 0.65, fog * 0.45);
    const flightDisruption01 = clamp01(storm * 0.8 + fog * 0.5 + wind * 0.4 + flood * 0.15);
    const shipDisruption01 = clamp01(storm * 0.75 + wind * 0.45 + flood * 0.2);
    const powerGridDamageRisk01 = clamp01(storm * 0.7 + flood * 0.5 + wind * 0.35);
    const roadGripMultiplier = Math.max(0.45, 1 - state.wetRoads01 * 0.35 - flood * 0.2);
    const agriculturalYieldMultiplier = Math.max(
      0.45,
      Math.min(1.2, 1 + rain * 0.12 - heat * 0.25 - flood * 0.35 - storm * 0.15)
    );

    return {
      weatherStateId: state.weatherStateId,
      regionId: state.regionId,
      solarOutputMultiplier: Math.max(0.2, 1 - solarPenalty),
      flightDisruption01,
      shipDisruption01,
      powerGridDamageRisk01,
      agriculturalYieldMultiplier,
      roadGripMultiplier,
      updatedAt: new Date().toISOString(),
    };
  }
}
