import { randomUUID } from "node:crypto";

// These are gameplay impact indicators, not physical engineering forecasts.
const KINDS = Object.freeze({
  road: impact => Math.max(impact.wetRoads01 || 0, impact.floodingIntensity01 || 0),
  grid: impact => impact.powerGridDamageRisk01,
  aviation: impact => impact.flightDisruption01,
  maritime: impact => impact.shipDisruption01,
  agriculture: impact => Math.max(0, (1 - impact.agriculturalYieldMultiplier) / 0.55),
});
const COUNTRIES = new Set(["Nigeria", "Ghana"]);
const clamp = value => Math.max(0, Math.min(1, value));
const validName = (value, size = 80) => typeof value === "string" && value.trim().length > 0 && value.length <= size && !/[\u0000-\u001f]/.test(value);
const copy = record => record ? JSON.parse(JSON.stringify(record)) : null;

export class EnvironmentalResponseService {
  #incidents = new Map();
  #byRegionKind = new Map();
  #requests = new Map();
  #workOrders = new Set();
  #weather;
  #media;
  #clock;

  constructor({ weather, media, clock = () => new Date().toISOString() }) {
    if (!weather || !media) throw new Error("environmental_dependencies_required");
    this.#weather = weather;
    this.#media = media;
    this.#clock = clock;
  }

  // Never invent weather. Only existing, separately identified regional
  // simulation state can authorize a disruption.
  assess(countryId, regionId) {
    if (!COUNTRIES.has(countryId) || !validName(regionId)) return null;
    const current = this.#weather.getRegionalWeather(countryId, regionId);
    if (!current) return null;
    const { weather, impact } = current;
    const surface = {
      ...impact,
      wetRoads01: weather.wetRoads01,
      floodingIntensity01: weather.floodingIntensity01,
    };
    return {
      countryId,
      regionId,
      weatherStateId: weather.weatherStateId,
      condition: weather.primaryCondition,
      season: weather.season,
      measuredAt: weather.updatedAt,
      disruption: Object.fromEntries(
        Object.entries(KINDS).map(([kind, formula]) => [kind, clamp(formula(surface))])
      ),
    };
  }

  open(input) {
    const countryId = input?.countryId;
    const regionId = input?.regionId;
    const kind = input?.kind;
    const requestId = input?.requestId;
    if (!COUNTRIES.has(countryId) || !validName(regionId) ||
        !Object.hasOwn(KINDS, kind) || !validName(requestId, 120))
      return { ok: false, error: "invalid_environmental_disruption" };

    const requestKey = countryId + "|" + requestId;
    const previousRequest = this.#requests.get(requestKey);
    if (previousRequest) {
      if (previousRequest.regionId !== regionId || previousRequest.kind !== kind)
        return { ok: false, error: "request_id_conflict" };
      return { ok: true, incident: copy(this.#incidents.get(previousRequest.incidentId)), replay: true };
    }

    const assessment = this.assess(countryId, regionId);
    if (!assessment) return { ok: false, error: "weather_state_not_found" };
    const severity01 = assessment.disruption[kind];
    if (severity01 < 0.3) return { ok: false, error: "no_significant_disruption" };

    const key = countryId + "|" + regionId + "|" + kind;
    const current = this.#incidents.get(this.#byRegionKind.get(key));
    if (current && current.status !== "restored") {
      this.#requests.set(requestKey, { incidentId: current.incidentId, regionId, kind });
      return { ok: true, incident: copy(current), replay: true };
    }

    const incident = {
      incidentId: randomUUID(),
      countryId,
      regionId,
      kind,
      sourceWeatherStateId: assessment.weatherStateId,
      status: "disrupted",
      severity01,
      recovery01: 0,
      createdAt: this.#clock(),
      updatedAt: this.#clock(),
      restoredAt: null,
      alertId: null,
      // Explainable service impacts; NO independent money, stock, or infrastructure writes.
      modifiers: this.#modifiers(kind, severity01),
    };
    if (severity01 >= 0.75) {
      const alert = this.#media.createEmergencyAlert({
        countryId, regionId, alertType: "fictional-weather-disruption",
        messageTag: "SIMULATION_ONLY_WEATHER_SERVICE_DISRUPTION",
        severity: severity01 >= 0.9 ? 4 : 3,
      });
      if (alert.ok) incident.alertId = alert.alert.alertId;
    }
    this.#incidents.set(incident.incidentId, incident);
    this.#byRegionKind.set(key, incident.incidentId);
    this.#requests.set(requestKey, { incidentId: incident.incidentId, regionId, kind });
    return { ok: true, incident: copy(incident), replay: false };
  }

  advance(input) {
    const incident = this.#incidents.get(input?.incidentId);
    const effort01 = Number(input?.effort01);
    if (!incident) return { ok: false, error: "disruption_not_found" };
    if (!validName(input?.workOrderId, 120) ||
        !Number.isFinite(effort01) || effort01 <= 0 || effort01 > 1)
      return { ok: false, error: "invalid_recovery_work" };
    const workKey = incident.incidentId + "|" + input.workOrderId;
    if (this.#workOrders.has(workKey))
      return { ok: true, incident: copy(incident), replay: true };
    if (incident.status === "restored")
      return { ok: false, error: "already_restored" };

    const assessment = this.assess(incident.countryId, incident.regionId);
    // Work proceeds under adverse conditions, but bad weather slows recovery.
    const weatherPenalty = Math.min(0.65, (assessment?.disruption[incident.kind] || 0) * 0.5);
    incident.recovery01 = clamp(incident.recovery01 + effort01 * (1 - weatherPenalty));
    incident.updatedAt = this.#clock();
    incident.status = incident.recovery01 >= 0.999 ? "restored" : "recovering";
    if (incident.status === "restored") {
      incident.recovery01 = 1;
      incident.restoredAt = this.#clock();
      if (incident.alertId) this.#media.resolveAlert(incident.alertId);
    }
    incident.modifiers = this.#modifiers(incident.kind, incident.severity01 * (1 - incident.recovery01));
    this.#workOrders.add(workKey);
    return { ok: true, incident: copy(incident), replay: false };
  }

  get(incidentId) { return copy(this.#incidents.get(incidentId)); }

  list({ countryId = "", regionId = "", status = "" } = {}) {
    return [...this.#incidents.values()]
      .filter(item => !countryId || item.countryId === countryId)
      .filter(item => !regionId || item.regionId === regionId)
      .filter(item => !status || item.status === status)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || a.incidentId.localeCompare(b.incidentId))
      .map(copy);
  }

  #modifiers(kind, severity01) {
    const value = clamp(severity01);
    switch (kind) {
      case "road": return { roadCapacityMultiplier: 1 - value * 0.8, travelDelay01: value };
      case "grid": return { gridAvailabilityMultiplier: 1 - value * 0.85, repairPriority01: value };
      case "aviation": return { flightCapacityMultiplier: 1 - value * 0.9, scheduleDelay01: value };
      case "maritime": return { maritimeCapacityMultiplier: 1 - value * 0.85, scheduleDelay01: value };
      case "agriculture": return { agriculturalOutputMultiplier: 1 - value * 0.65, supplyPressure01: value };
      default: throw new Error("unknown_environmental_domain");
    }
  }
}
