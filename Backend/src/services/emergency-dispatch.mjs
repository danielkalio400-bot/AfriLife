import { randomUUID } from "node:crypto";

const INCIDENT_TYPES = new Set([
  "medical",
  "fire",
  "road-incident",
  "vehicle-breakdown",
  "public-safety",
  "utility-failure",
  "other",
]);

const PRIORITIES = new Set(["low", "normal", "high", "critical"]);
const UNIT_TYPES = new Set(["police", "ambulance", "fire-service", "tow-service", "roadside-assistance"]);

function requiredUnitTypes(type) {
  switch (type) {
    case "medical": return ["ambulance"];
    case "fire": return ["fire-service", "ambulance"];
    case "road-incident": return ["police", "ambulance", "tow-service"];
    case "vehicle-breakdown": return ["roadside-assistance", "tow-service"];
    case "public-safety": return ["police"];
    default: return [];
  }
}

export class EmergencyDispatchService {
  #calls = new Map();
  #incidents = new Map();
  #units = new Map();
  #reports = new Map();

  registerUnit(input) {
    const unitType = String(input?.unitType || "").trim();
    const regionId = String(input?.regionId || "").trim();
    if (!UNIT_TYPES.has(unitType) || !regionId)
      return { ok: false, error: "invalid_dispatch_unit" };

    const unit = {
      unitId: String(input?.unitId || randomUUID()),
      unitType,
      regionId,
      homeBaseId: String(input?.homeBaseId || "").trim(),
      assignedIncidentId: "",
      available: input?.available !== false,
      condition01: Math.max(0, Math.min(1, Number(input?.condition01) || 1)),
      fuelLevel01: Math.max(0, Math.min(1, Number(input?.fuelLevel01) || 1)),
    };
    this.#units.set(unit.unitId, unit);
    return { ok: true, unit: { ...unit } };
  }

  receiveCall(input) {
    const callerEntityId = String(input?.callerEntityId || "").trim();
    const regionId = String(input?.regionId || "").trim();
    const incidentType = String(input?.incidentType || "").trim();
    const priority = String(input?.priority || "normal").trim();

    if (!callerEntityId || !regionId || !INCIDENT_TYPES.has(incidentType) || !PRIORITIES.has(priority))
      return { ok: false, error: "invalid_emergency_call" };

    const call = {
      callId: randomUUID(),
      callerEntityId,
      regionId,
      locationTag: String(input?.locationTag || "").trim().slice(0, 120),
      incidentType,
      priority,
      status: "received",
      receivedAt: new Date().toISOString(),
    };
    this.#calls.set(call.callId, call);

    const incident = {
      incidentId: randomUUID(),
      callId: call.callId,
      regionId,
      type: incidentType,
      priority,
      status: "open",
      assignedUnitIds: [],
      trafficDiversionRequested: Boolean(input?.trafficDiversionRequested),
      hospitalTransportRequested: Boolean(input?.hospitalTransportRequested),
      destinationFacilityId: String(input?.destinationFacilityId || "").trim(),
      openedAt: new Date().toISOString(),
      resolvedAt: null,
    };
    this.#incidents.set(incident.incidentId, incident);
    return { ok: true, call: { ...call }, incident: { ...incident } };
  }

  dispatch(incidentId) {
    const incident = this.#incidents.get(incidentId);
    if (!incident) return { ok: false, error: "emergency_incident_not_found" };

    const assigned = [];
    for (const unitType of requiredUnitTypes(incident.type)) {
      const unit = [...this.#units.values()]
        .filter(candidate =>
          candidate.unitType === unitType &&
          candidate.regionId === incident.regionId &&
          candidate.available &&
          !candidate.assignedIncidentId &&
          candidate.condition01 > 0.2 &&
          candidate.fuelLevel01 > 0.05
        )
        .sort((a, b) => b.condition01 - a.condition01 || b.fuelLevel01 - a.fuelLevel01)[0];

      if (!unit) continue;
      unit.available = false;
      unit.assignedIncidentId = incident.incidentId;
      incident.assignedUnitIds.push(unit.unitId);
      assigned.push({ ...unit });
    }

    incident.status = assigned.length ? "units-assigned" : "open";
    return { ok: true, incident: { ...incident }, units: assigned };
  }

  updateIncident(incidentId, input) {
    const incident = this.#incidents.get(incidentId);
    if (!incident) return { ok: false, error: "emergency_incident_not_found" };

    const allowed = new Set(["open", "units-assigned", "responding", "transporting", "resolved", "closed"]);
    const status = String(input?.status || incident.status);
    if (!allowed.has(status)) return { ok: false, error: "invalid_incident_status" };

    incident.status = status;
    if (input?.trafficDiversionRequested !== undefined)
      incident.trafficDiversionRequested = Boolean(input.trafficDiversionRequested);
    if (input?.hospitalTransportRequested !== undefined)
      incident.hospitalTransportRequested = Boolean(input.hospitalTransportRequested);
    if (input?.destinationFacilityId !== undefined)
      incident.destinationFacilityId = String(input.destinationFacilityId || "").trim();

    if (status === "resolved" || status === "closed") {
      if (!incident.resolvedAt) incident.resolvedAt = new Date().toISOString();
      for (const unitId of incident.assignedUnitIds) {
        const unit = this.#units.get(unitId);
        if (unit) {
          unit.assignedIncidentId = "";
          unit.available = true;
        }
      }
    }

    return { ok: true, incident: { ...incident } };
  }

  createReport(incidentId, input = {}) {
    const incident = this.#incidents.get(incidentId);
    if (!incident) return { ok: false, error: "emergency_incident_not_found" };
    if (!["resolved", "closed"].includes(incident.status))
      return { ok: false, error: "incident_not_resolved" };

    const unitTypes = incident.assignedUnitIds
      .map(id => this.#units.get(id)?.unitType)
      .filter(Boolean);

    const report = {
      reportId: randomUUID(),
      incidentId,
      outcomeCode: String(input?.outcomeCode || "resolved").slice(0, 64),
      unitsDispatched: incident.assignedUnitIds.length,
      openedAt: incident.openedAt,
      resolvedAt: incident.resolvedAt,
      hospitalTransportUsed: Boolean(incident.hospitalTransportRequested),
      trafficDiversionUsed: Boolean(incident.trafficDiversionRequested),
      towServiceUsed: unitTypes.includes("tow-service"),
    };
    this.#reports.set(report.reportId, report);
    return { ok: true, report: { ...report } };
  }

  getIncident(incidentId) {
    const incident = this.#incidents.get(incidentId);
    return incident ? { ...incident } : null;
  }
}
