import { randomUUID } from "node:crypto";

export class CorrectionsService {
  #facilities = new Map();
  #records = new Map();
  #programs = new Map();
  #visits = new Map();
  #healthRequests = new Map();
  #paroleReviews = new Map();
  #reintegrationPlans = new Map();

  registerFacility(input) {
    const facilityId = String(input?.facilityId || randomUUID());
    const countryId = String(input?.countryId || "").trim();
    const regionId = String(input?.regionId || "").trim();
    const capacity = Math.max(1, Math.trunc(Number(input?.capacity) || 1));

    if (!countryId || !regionId)
      return { ok: false, error: "invalid_correctional_facility" };

    const facility = {
      facilityId,
      countryId,
      regionId,
      capacity,
      occupancy: 0,
      open: input?.open !== false,
    };
    this.#facilities.set(facilityId, facility);
    return { ok: true, facility: { ...facility } };
  }

  intake(input) {
    const facility = this.#facilities.get(String(input?.facilityId || ""));
    const personEntityId = String(input?.personEntityId || "").trim();
    const courtDecisionId = String(input?.courtDecisionId || "").trim();
    const sentenceDays = Math.max(0, Math.trunc(Number(input?.sentenceDays) || 0));

    if (!facility || !facility.open) return { ok: false, error: "correctional_facility_unavailable" };
    if (facility.occupancy >= facility.capacity) return { ok: false, error: "correctional_facility_full" };
    if (!personEntityId || !courtDecisionId || sentenceDays <= 0)
      return { ok: false, error: "invalid_correctional_intake" };

    const now = new Date().toISOString();
    const record = {
      recordId: randomUUID(),
      personEntityId,
      courtDecisionId,
      facilityId: facility.facilityId,
      cellId: "",
      state: "intake",
      sentenceDays,
      daysServed: 0,
      startedAt: now,
      updatedAt: now,
    };

    facility.occupancy++;
    this.#records.set(record.recordId, record);
    return { ok: true, record: { ...record } };
  }

  assignCell(recordId, input) {
    const record = this.#records.get(recordId);
    if (!record) return { ok: false, error: "incarceration_record_not_found" };
    const cellId = String(input?.cellId || "").trim();
    if (!cellId) return { ok: false, error: "invalid_cell_assignment" };

    record.cellId = cellId;
    record.state = "serving-sentence";
    record.updatedAt = new Date().toISOString();
    return {
      ok: true,
      assignment: {
        assignmentId: randomUUID(),
        recordId,
        facilityId: record.facilityId,
        cellId,
        capacity: Math.max(1, Math.trunc(Number(input?.capacity) || 1)),
        occupancy: Math.max(1, Math.trunc(Number(input?.occupancy) || 1)),
      },
      record: { ...record },
    };
  }

  enrollProgram(recordId, input) {
    if (!this.#records.has(recordId)) return { ok: false, error: "incarceration_record_not_found" };
    const programType = String(input?.programType || "").trim();
    const allowed = new Set(["recreation", "work", "education", "rehabilitation", "health-care"]);
    if (!allowed.has(programType)) return { ok: false, error: "invalid_correctional_program" };

    const enrollment = {
      enrollmentId: randomUUID(),
      recordId,
      programType,
      plannedSessions: Math.max(1, Math.trunc(Number(input?.plannedSessions) || 1)),
      completedSessions: 0,
      active: true,
    };
    this.#programs.set(enrollment.enrollmentId, enrollment);
    return { ok: true, enrollment: { ...enrollment } };
  }

  advanceProgram(enrollmentId, completedSessions = 1) {
    const enrollment = this.#programs.get(enrollmentId);
    if (!enrollment) return { ok: false, error: "correctional_program_not_found" };

    enrollment.completedSessions = Math.min(
      enrollment.plannedSessions,
      enrollment.completedSessions + Math.max(1, Math.trunc(Number(completedSessions) || 1))
    );
    enrollment.active = enrollment.completedSessions < enrollment.plannedSessions;
    return { ok: true, enrollment: { ...enrollment } };
  }

  scheduleVisit(recordId, input) {
    if (!this.#records.has(recordId)) return { ok: false, error: "incarceration_record_not_found" };
    const visitorEntityId = String(input?.visitorEntityId || "").trim();
    const visitType = String(input?.visitType || "").trim();
    const startsAt = input?.scheduledAt ? Date.parse(String(input.scheduledAt)) : NaN;
    if (!visitorEntityId || !["family", "lawyer"].includes(visitType) || !Number.isFinite(startsAt))
      return { ok: false, error: "invalid_correctional_visit" };

    const visit = {
      visitId: randomUUID(),
      recordId,
      visitorEntityId,
      visitType,
      scheduledAt: new Date(startsAt).toISOString(),
      durationMinutes: Math.min(180, Math.max(15, Math.trunc(Number(input?.durationMinutes) || 30))),
      status: "scheduled",
    };
    this.#visits.set(visit.visitId, visit);
    return { ok: true, visit: { ...visit } };
  }

  requestHealthCare(recordId, input = {}) {
    if (!this.#records.has(recordId)) return { ok: false, error: "incarceration_record_not_found" };
    const priority = ["routine", "priority", "urgent"].includes(input?.priority)
      ? input.priority
      : "routine";

    const request = {
      requestId: randomUUID(),
      recordId,
      priority,
      status: "requested",
      requestedAt: new Date().toISOString(),
    };
    this.#healthRequests.set(request.requestId, request);
    return { ok: true, request: { ...request } };
  }

  advanceTime(recordId, requestedDays) {
    const record = this.#records.get(recordId);
    if (!record) return { ok: false, error: "incarceration_record_not_found" };
    if (record.state === "released") return { ok: false, error: "record_already_released" };

    const advancedDays = Math.min(
      Math.max(0, Math.trunc(Number(requestedDays) || 0)),
      Math.max(0, record.sentenceDays - record.daysServed)
    );
    record.daysServed += advancedDays;
    if (record.daysServed >= record.sentenceDays) record.state = "release-approved";
    record.updatedAt = new Date().toISOString();

    return { ok: true, advancedDays, record: { ...record } };
  }

  reviewParole(recordId, input = {}) {
    const record = this.#records.get(recordId);
    if (!record) return { ok: false, error: "incarceration_record_not_found" };

    const minimumDaysRequired = Math.max(
      1,
      Math.min(record.sentenceDays, Math.trunc(Number(input?.minimumDaysRequired) || Math.ceil(record.sentenceDays * 0.5)))
    );
    const eligible = record.daysServed >= minimumDaysRequired;
    const approved = eligible && input?.approve === true;

    const review = {
      reviewId: randomUUID(),
      recordId,
      state: approved ? "approved" : eligible ? "declined" : "not-eligible",
      minimumDaysRequired,
      reviewedAt: new Date().toISOString(),
      outcomeTag: String(input?.outcomeTag || "").slice(0, 120),
    };
    this.#paroleReviews.set(review.reviewId, review);

    if (approved) record.state = "release-approved";
    else if (eligible) record.state = "parole-review";
    record.updatedAt = new Date().toISOString();

    return { ok: true, review: { ...review }, record: { ...record } };
  }

  release(recordId, input = {}) {
    const record = this.#records.get(recordId);
    if (!record) return { ok: false, error: "incarceration_record_not_found" };
    if (record.state !== "release-approved")
      return { ok: false, error: "release_not_approved" };

    record.state = "released";
    record.updatedAt = new Date().toISOString();

    const facility = this.#facilities.get(record.facilityId);
    if (facility) facility.occupancy = Math.max(0, facility.occupancy - 1);

    const plan = {
      planId: randomUUID(),
      personEntityId: record.personEntityId,
      housingSupport: Boolean(input?.housingSupport),
      employmentSupport: Boolean(input?.employmentSupport),
      educationSupport: Boolean(input?.educationSupport),
      healthFollowUp: Boolean(input?.healthFollowUp),
      familySupport: Boolean(input?.familySupport),
      status: "planned",
    };
    this.#reintegrationPlans.set(plan.planId, plan);

    return { ok: true, record: { ...record }, reintegrationPlan: { ...plan } };
  }

  get(recordId) {
    const record = this.#records.get(recordId);
    return record ? { ...record } : null;
  }
}
