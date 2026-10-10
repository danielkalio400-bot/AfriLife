import { randomUUID } from "node:crypto";

const CASE_TYPES = new Set([
  "general",
  "property",
  "financial-fraud",
  "cybercrime-high-level",
  "organized-financial-crime",
]);

export class JusticeInvestigationService {
  #cases = new Map();
  #statements = new Map();
  #evidence = new Map();
  #chain = new Map();
  #suspiciousTransactions = new Map();
  #freezeOrders = new Map();
  #cooperation = new Map();
  #operations = new Map();
  #patrols = new Map();
  #trafficRecords = new Map();
  #arrests = new Map();

  createCase(input) {
    const type = String(input?.type || "general").trim();
    const regionId = String(input?.regionId || "").trim();
    const leadAgencyId = String(input?.leadAgencyId || "").trim();
    if (!CASE_TYPES.has(type) || !regionId || !leadAgencyId)
      return { ok: false, error: "invalid_investigation_case" };

    const now = new Date().toISOString();
    const investigation = {
      caseId: randomUUID(),
      type,
      state: "open",
      leadAgencyId,
      regionId,
      statementCount: 0,
      evidenceCount: 0,
      openedAt: now,
      updatedAt: now,
    };
    this.#cases.set(investigation.caseId, investigation);
    return { ok: true, case: { ...investigation } };
  }

  addStatement(caseId, input) {
    const investigation = this.#cases.get(caseId);
    if (!investigation) return { ok: false, error: "investigation_case_not_found" };
    const personEntityId = String(input?.personEntityId || "").trim();
    if (!personEntityId) return { ok: false, error: "invalid_statement" };

    const statement = {
      statementId: randomUUID(),
      caseId,
      personEntityId,
      statementTag: String(input?.statementTag || "").slice(0, 240),
      recordedAt: new Date().toISOString(),
    };
    this.#statements.set(statement.statementId, statement);
    investigation.statementCount++;
    investigation.updatedAt = new Date().toISOString();
    return { ok: true, statement: { ...statement } };
  }

  addEvidence(caseId, input) {
    const investigation = this.#cases.get(caseId);
    if (!investigation) return { ok: false, error: "investigation_case_not_found" };

    const evidence = {
      evidenceId: randomUUID(),
      caseId,
      evidenceType: String(input?.evidenceType || "record").slice(0, 64),
      descriptionTag: String(input?.descriptionTag || "").slice(0, 160),
      currentCustodianId: String(input?.currentCustodianId || "").slice(0, 120),
      collectedAt: new Date().toISOString(),
    };
    this.#evidence.set(evidence.evidenceId, evidence);
    investigation.evidenceCount++;
    investigation.state = "reviewing-evidence";
    investigation.updatedAt = new Date().toISOString();
    return { ok: true, evidence: { ...evidence } };
  }

  transferEvidence(evidenceId, input) {
    const evidence = this.#evidence.get(evidenceId);
    if (!evidence) return { ok: false, error: "evidence_not_found" };

    const toCustodianId = String(input?.toCustodianId || "").trim();
    if (!toCustodianId) return { ok: false, error: "invalid_evidence_transfer" };

    const entry = {
      chainEntryId: randomUUID(),
      evidenceId,
      fromCustodianId: evidence.currentCustodianId,
      toCustodianId,
      actionTag: String(input?.actionTag || "transfer").slice(0, 64),
      recordedAt: new Date().toISOString(),
    };
    evidence.currentCustodianId = toCustodianId;
    this.#chain.set(entry.chainEntryId, entry);
    return { ok: true, chainEntry: { ...entry }, evidence: { ...evidence } };
  }

  flagSuspiciousTransaction(input) {
    const accountId = String(input?.accountId || "").trim();
    if (!accountId) return { ok: false, error: "invalid_suspicious_transaction_record" };

    const record = {
      recordId: randomUUID(),
      accountId,
      currency: String(input?.currency || "NGN"),
      amountMinorUnits: Math.max(0, Math.trunc(Number(input?.amountMinorUnits) || 0)),
      reasonTag: String(input?.reasonTag || "review-required").slice(0, 120),
      reviewStatus: "flagged",
      flaggedAt: new Date().toISOString(),
    };
    this.#suspiciousTransactions.set(record.recordId, record);
    return { ok: true, record: { ...record } };
  }

  createFreezeOrder(caseId, input) {
    if (!this.#cases.has(caseId)) return { ok: false, error: "investigation_case_not_found" };
    const assetId = String(input?.assetId || "").trim();
    const legalAuthorityRef = String(input?.legalAuthorityRef || "").trim();
    if (!assetId || !legalAuthorityRef) return { ok: false, error: "legal_authority_required" };

    const order = {
      orderId: randomUUID(),
      caseId,
      assetId,
      legalAuthorityRef,
      startsAt: new Date().toISOString(),
      endsAt: input?.endsAt ? String(input.endsAt) : null,
      active: true,
    };
    this.#freezeOrders.set(order.orderId, order);
    return { ok: true, order: { ...order } };
  }

  createAuthorizedOperation(caseId, input) {
    if (!this.#cases.has(caseId)) return { ok: false, error: "investigation_case_not_found" };
    const legalAuthorityRef = String(input?.legalAuthorityRef || "").trim();
    const operationType = String(input?.operationType || "").trim();
    if (!legalAuthorityRef || !["search-record", "arrest-record"].includes(operationType))
      return { ok: false, error: "invalid_or_unauthorized_operation" };

    const operation = {
      operationId: randomUUID(),
      caseId,
      operationType,
      legalAuthorityRef,
      status: "authorized",
      outcomeTag: "",
      authorizedAt: new Date().toISOString(),
    };
    this.#operations.set(operation.operationId, operation);
    return { ok: true, operation: { ...operation } };
  }

  requestAgencyCooperation(caseId, input) {
    if (!this.#cases.has(caseId)) return { ok: false, error: "investigation_case_not_found" };
    const requestingAgencyId = String(input?.requestingAgencyId || "").trim();
    const respondingAgencyId = String(input?.respondingAgencyId || "").trim();
    if (!requestingAgencyId || !respondingAgencyId)
      return { ok: false, error: "invalid_agency_cooperation_request" };

    const request = {
      cooperationId: randomUUID(),
      caseId,
      requestingAgencyId,
      respondingAgencyId,
      requestTag: String(input?.requestTag || "case-support").slice(0, 120),
      status: "requested",
      requestedAt: new Date().toISOString(),
    };
    this.#cooperation.set(request.cooperationId, request);
    return { ok: true, cooperation: { ...request } };
  }

  registerPatrol(input) {
    const regionId = String(input?.regionId || "").trim();
    const stationId = String(input?.stationId || "").trim();
    if (!regionId || !stationId) return { ok: false, error: "invalid_patrol_unit" };
    const patrol = {
      unitId: String(input?.unitId || randomUUID()),
      regionId,
      stationId,
      assignedZoneId: String(input?.assignedZoneId || "").trim(),
      available: true,
      onPatrol: Boolean(input?.onPatrol ?? true),
    };
    this.#patrols.set(patrol.unitId, patrol);
    return { ok: true, patrol: { ...patrol } };
  }

  recordTrafficEnforcement(input) {
    const vehicleId = String(input?.vehicleId || "").trim();
    const driverEntityId = String(input?.driverEntityId || "").trim();
    if (!vehicleId || !driverEntityId) return { ok: false, error: "invalid_traffic_enforcement_record" };

    const record = {
      recordId: randomUUID(),
      vehicleId,
      driverEntityId,
      ruleTag: String(input?.ruleTag || "traffic-rule").slice(0, 80),
      outcome: String(input?.outcome || "warning").slice(0, 40),
      fineMinorUnits: Math.max(0, Math.trunc(Number(input?.fineMinorUnits) || 0)),
      recordedAt: new Date().toISOString(),
    };
    this.#trafficRecords.set(record.recordId, record);
    return { ok: true, record: { ...record } };
  }

  recordArrest(caseId, input) {
    if (!this.#cases.has(caseId)) return { ok: false, error: "investigation_case_not_found" };
    const personEntityId = String(input?.personEntityId || "").trim();
    const legalAuthorityRef = String(input?.legalAuthorityRef || "").trim();
    if (!personEntityId || !legalAuthorityRef) return { ok: false, error: "legal_authority_required" };

    const record = {
      arrestRecordId: randomUUID(),
      personEntityId,
      caseId,
      legalAuthorityRef,
      status: "recorded",
      recordedAt: new Date().toISOString(),
    };
    this.#arrests.set(record.arrestRecordId, record);
    return { ok: true, arrest: { ...record } };
  }
}
