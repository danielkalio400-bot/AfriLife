import { randomUUID } from "node:crypto";

const TYPES = new Set([
  "phone-theft",
  "wallet-theft",
  "vehicle-theft",
  "package-theft",
  "shop-theft",
  "home-burglary",
  "property-theft",
]);

export class PropertyIncidentService {
  #incidents = new Map();
  #items = new Map();
  #cctv = new Map();
  #witnesses = new Map();
  #policeReports = new Map();
  #recoveries = new Map();
  #claims = new Map();
  #investigations = new Map();

  report(input) {
    const ownerEntityId = String(input?.ownerEntityId || "").trim();
    const regionId = String(input?.regionId || "").trim();
    const type = String(input?.type || "").trim();
    if (!ownerEntityId || !regionId || !TYPES.has(type))
      return { ok: false, error: "invalid_property_incident" };

    const item = {
      itemRecordId: randomUUID(),
      ownerEntityId,
      category: String(input?.category || "property").trim().slice(0, 64),
      descriptionTag: String(input?.descriptionTag || "").trim().slice(0, 120),
      serialOrRegistrationTag: String(input?.serialOrRegistrationTag || "").trim().slice(0, 120),
      recovered: false,
      recoveredAt: null,
    };
    this.#items.set(item.itemRecordId, item);

    const incident = {
      incidentId: randomUUID(),
      ownerEntityId,
      regionId,
      type,
      itemRecordId: item.itemRecordId,
      status: "reported",
      reportedAt: new Date().toISOString(),
      recovered: false,
    };
    this.#incidents.set(incident.incidentId, incident);
    return { ok: true, incident: { ...incident }, item: { ...item } };
  }

  addCctvObservation(incidentId, input) {
    if (!this.#incidents.has(incidentId))
      return { ok: false, error: "property_incident_not_found" };

    const record = {
      observationId: randomUUID(),
      incidentId,
      cameraId: String(input?.cameraId || "").trim().slice(0, 80),
      locationTag: String(input?.locationTag || "").trim().slice(0, 120),
      observationTag: String(input?.observationTag || "").trim().slice(0, 160),
      capturedAt: input?.capturedAt ? String(input.capturedAt) : new Date().toISOString(),
      preservedForReview: Boolean(input?.preservedForReview ?? true),
    };
    this.#cctv.set(record.observationId, record);
    return { ok: true, observation: { ...record } };
  }

  addWitness(incidentId, input) {
    if (!this.#incidents.has(incidentId))
      return { ok: false, error: "property_incident_not_found" };

    const witnessEntityId = String(input?.witnessEntityId || "").trim();
    if (!witnessEntityId) return { ok: false, error: "invalid_witness" };

    const record = {
      witnessRecordId: randomUUID(),
      incidentId,
      witnessEntityId,
      statementTag: String(input?.statementTag || "").trim().slice(0, 200),
      recordedAt: new Date().toISOString(),
      availableForFollowUp: input?.availableForFollowUp !== false,
    };
    this.#witnesses.set(record.witnessRecordId, record);
    return { ok: true, witness: { ...record } };
  }

  filePoliceReport(incidentId, input) {
    const incident = this.#incidents.get(incidentId);
    if (!incident) return { ok: false, error: "property_incident_not_found" };

    const reportingEntityId = String(input?.reportingEntityId || incident.ownerEntityId).trim();
    const stationId = String(input?.stationId || "").trim();
    if (!reportingEntityId || !stationId) return { ok: false, error: "invalid_police_report" };

    const report = {
      reportId: randomUUID(),
      incidentId,
      reportingEntityId,
      stationId,
      status: "filed",
      filedAt: new Date().toISOString(),
    };
    incident.status = "under-review";
    this.#policeReports.set(report.reportId, report);
    return { ok: true, report: { ...report }, incident: { ...incident } };
  }

  openInvestigation(incidentId) {
    const incident = this.#incidents.get(incidentId);
    if (!incident) return { ok: false, error: "property_incident_not_found" };

    const evidenceRecordCount =
      [...this.#cctv.values()].filter(record => record.incidentId === incidentId).length;
    const witnessRecordCount =
      [...this.#witnesses.values()].filter(record => record.incidentId === incidentId).length;

    const investigation = {
      investigationId: randomUUID(),
      incidentId,
      state: evidenceRecordCount || witnessRecordCount ? "reviewing-evidence" : "open",
      evidenceRecordCount,
      witnessRecordCount,
      itemRecovered: incident.recovered,
      openedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    incident.status = "investigating";
    this.#investigations.set(investigation.investigationId, investigation);
    return { ok: true, investigation: { ...investigation } };
  }

  recover(incidentId, input = {}) {
    const incident = this.#incidents.get(incidentId);
    if (!incident) return { ok: false, error: "property_incident_not_found" };
    const item = this.#items.get(incident.itemRecordId);
    if (!item) return { ok: false, error: "stolen_item_record_not_found" };

    item.recovered = true;
    item.recoveredAt = new Date().toISOString();
    incident.recovered = true;
    incident.status = "recovered";

    const recovery = {
      recoveryId: randomUUID(),
      incidentId,
      itemRecordId: item.itemRecordId,
      recoverySource: String(input?.recoverySource || "investigation").slice(0, 64),
      recoveredAt: item.recoveredAt,
      returnedToOwner: Boolean(input?.returnedToOwner),
    };
    this.#recoveries.set(recovery.recoveryId, recovery);
    return { ok: true, recovery: { ...recovery }, incident: { ...incident }, item: { ...item } };
  }

  createInsuranceClaim(incidentId, input) {
    const incident = this.#incidents.get(incidentId);
    if (!incident) return { ok: false, error: "property_incident_not_found" };

    const policyId = String(input?.policyId || "").trim();
    const claimantEntityId = String(input?.claimantEntityId || incident.ownerEntityId).trim();
    if (!policyId || !claimantEntityId)
      return { ok: false, error: "invalid_insurance_claim" };

    const claim = {
      claimId: randomUUID(),
      incidentId,
      policyId,
      claimantEntityId,
      claimedAmountMinorUnits: Math.max(0, Math.trunc(Number(input?.claimedAmountMinorUnits) || 0)),
      state: "submitted",
      submittedAt: new Date().toISOString(),
    };
    this.#claims.set(claim.claimId, claim);
    return { ok: true, claim: { ...claim } };
  }

  updateClaim(claimId, state) {
    const claim = this.#claims.get(claimId);
    if (!claim) return { ok: false, error: "insurance_claim_not_found" };
    const allowed = new Set(["submitted", "reviewing", "approved", "rejected", "settled"]);
    if (!allowed.has(state)) return { ok: false, error: "invalid_insurance_claim_state" };
    claim.state = state;
    return { ok: true, claim: { ...claim } };
  }

  getIncident(incidentId) {
    const incident = this.#incidents.get(incidentId);
    return incident ? { ...incident } : null;
  }
}
