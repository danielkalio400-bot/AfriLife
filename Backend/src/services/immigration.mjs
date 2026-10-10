import { randomUUID } from "node:crypto";

const COUNTRIES = new Set(["Nigeria", "Ghana"]);
const VISA_STATES = new Set([
  "draft",
  "submitted",
  "processing",
  "interview-scheduled",
  "approved",
  "refused",
  "withdrawn",
]);
const PERMIT_TYPES = new Set(["residence", "work", "student"]);

export class ImmigrationService {
  #citizenship = new Map();
  #passports = new Map();
  #applications = new Map();
  #documents = new Map();
  #biometrics = new Map();
  #interviews = new Map();
  #queues = new Map();
  #permits = new Map();
  #offices = new Map();
  #missions = new Map();
  #entryExit = new Map();
  #borderAssignments = new Map();

  registerOffice(input) {
    const countryId = String(input?.countryId || "").trim();
    const cityId = String(input?.cityId || "").trim();
    if (!COUNTRIES.has(countryId) || !cityId)
      return { ok: false, error: "invalid_immigration_office" };

    const office = {
      officeId: String(input?.officeId || randomUUID()),
      countryId,
      cityId,
      officeType: String(input?.officeType || "immigration-office").slice(0, 40),
      dailyProcessingCapacity: Math.max(1, Math.trunc(Number(input?.dailyProcessingCapacity) || 50)),
      currentQueueLength: 0,
      open: input?.open !== false,
    };
    this.#offices.set(office.officeId, office);
    return { ok: true, office: { ...office } };
  }

  registerMission(input) {
    const representedCountryId = String(input?.representedCountryId || "").trim();
    const hostCountryId = String(input?.hostCountryId || "").trim();
    const cityId = String(input?.cityId || "").trim();
    if (!COUNTRIES.has(representedCountryId) || !COUNTRIES.has(hostCountryId) || !cityId)
      return { ok: false, error: "invalid_diplomatic_mission" };

    const mission = {
      missionId: String(input?.missionId || randomUUID()),
      representedCountryId,
      hostCountryId,
      cityId,
      missionType: ["embassy", "consulate"].includes(input?.missionType) ? input.missionType : "embassy",
      acceptingApplications: input?.acceptingApplications !== false,
    };
    this.#missions.set(mission.missionId, mission);
    return { ok: true, mission: { ...mission } };
  }

  setCitizenship(input) {
    const personEntityId = String(input?.personEntityId || "").trim();
    const countryId = String(input?.countryId || "").trim();
    const status = String(input?.status || "citizen").trim();
    if (!personEntityId || !COUNTRIES.has(countryId) ||
        !["citizen", "permanent-resident", "temporary-resident", "visitor"].includes(status))
      return { ok: false, error: "invalid_citizenship_record" };

    const record = {
      recordId: randomUUID(),
      personEntityId,
      countryId,
      status,
      effectiveAt: new Date().toISOString(),
    };
    this.#citizenship.set(`${personEntityId}:${countryId}`, record);
    return { ok: true, record: { ...record } };
  }

  createPassportApplication(input) {
    const personEntityId = String(input?.personEntityId || "").trim();
    const issuingCountryId = String(input?.issuingCountryId || "").trim();
    if (!personEntityId || !COUNTRIES.has(issuingCountryId))
      return { ok: false, error: "invalid_passport_application" };

    const record = {
      passportRecordId: randomUUID(),
      personEntityId,
      issuingCountryId,
      state: "application",
      appliedAt: new Date().toISOString(),
      issuedAt: null,
      expiresAt: null,
    };
    this.#passports.set(record.passportRecordId, record);
    return { ok: true, passport: { ...record } };
  }

  issuePassport(passportRecordId, input = {}) {
    const record = this.#passports.get(passportRecordId);
    if (!record) return { ok: false, error: "passport_record_not_found" };
    const years = Math.min(10, Math.max(1, Math.trunc(Number(input?.validYears) || 5)));
    const now = Date.now();
    record.state = "issued";
    record.issuedAt = new Date(now).toISOString();
    record.expiresAt = new Date(now + years * 365 * 24 * 60 * 60 * 1000).toISOString();
    return { ok: true, passport: { ...record } };
  }

  createVisaApplication(input) {
    const personEntityId = String(input?.personEntityId || "").trim();
    const destinationCountryId = String(input?.destinationCountryId || "").trim();
    const visaCategory = String(input?.visaCategory || "").trim().slice(0, 64);
    const processingOfficeId = String(input?.processingOfficeId || "").trim();

    if (!personEntityId || !COUNTRIES.has(destinationCountryId) || !visaCategory)
      return { ok: false, error: "invalid_visa_application" };
    if (processingOfficeId && !this.#offices.has(processingOfficeId) && !this.#missions.has(processingOfficeId))
      return { ok: false, error: "processing_office_not_found" };

    const now = new Date().toISOString();
    const application = {
      applicationId: randomUUID(),
      personEntityId,
      destinationCountryId,
      visaCategory,
      state: "draft",
      processingOfficeId,
      supportingDocumentIds: [],
      submittedAt: null,
      updatedAt: now,
    };
    this.#applications.set(application.applicationId, application);
    return { ok: true, application: structuredClone(application) };
  }

  attachDocument(applicationId, input) {
    const application = this.#applications.get(applicationId);
    if (!application) return { ok: false, error: "visa_application_not_found" };

    const documentType = String(input?.documentType || "").trim().slice(0, 80);
    if (!documentType) return { ok: false, error: "invalid_supporting_document" };

    const document = {
      documentId: randomUUID(),
      applicationId,
      documentType,
      referenceTag: String(input?.referenceTag || "").trim().slice(0, 120),
      acceptedForReview: Boolean(input?.acceptedForReview ?? true),
    };
    this.#documents.set(document.documentId, document);
    application.supportingDocumentIds.push(document.documentId);
    application.updatedAt = new Date().toISOString();
    return { ok: true, document: { ...document }, application: structuredClone(application) };
  }

  submit(applicationId) {
    const application = this.#applications.get(applicationId);
    if (!application) return { ok: false, error: "visa_application_not_found" };
    if (application.state !== "draft")
      return { ok: false, error: "visa_application_not_draft" };

    application.state = "submitted";
    application.submittedAt = new Date().toISOString();
    application.updatedAt = application.submittedAt;

    let queue = null;
    if (application.processingOfficeId) {
      const office = this.#offices.get(application.processingOfficeId);
      const queueEntry = {
        queueEntryId: randomUUID(),
        applicationId,
        officeId: application.processingOfficeId,
        position: office ? ++office.currentQueueLength : 1,
        status: "waiting",
      };
      this.#queues.set(queueEntry.queueEntryId, queueEntry);
      queue = { ...queueEntry };
    }

    return { ok: true, application: structuredClone(application), queue };
  }

  scheduleBiometrics(applicationId, input) {
    const application = this.#applications.get(applicationId);
    if (!application) return { ok: false, error: "visa_application_not_found" };
    const scheduled = input?.scheduledAt ? Date.parse(String(input.scheduledAt)) : NaN;
    if (!Number.isFinite(scheduled) || scheduled <= Date.now())
      return { ok: false, error: "invalid_biometric_appointment" };

    const appointment = {
      appointmentId: randomUUID(),
      applicationId,
      officeId: String(input?.officeId || application.processingOfficeId || "").trim(),
      scheduledAt: new Date(scheduled).toISOString(),
      completed: false,
      identityCheckPassed: false,
    };
    this.#biometrics.set(appointment.appointmentId, appointment);
    return { ok: true, appointment: { ...appointment } };
  }

  scheduleInterview(applicationId, input) {
    const application = this.#applications.get(applicationId);
    if (!application) return { ok: false, error: "visa_application_not_found" };
    const scheduled = input?.scheduledAt ? Date.parse(String(input.scheduledAt)) : NaN;
    if (!Number.isFinite(scheduled) || scheduled <= Date.now())
      return { ok: false, error: "invalid_interview_schedule" };

    const interview = {
      interviewId: randomUUID(),
      applicationId,
      officerEntityId: String(input?.officerEntityId || "").trim(),
      scheduledAt: new Date(scheduled).toISOString(),
      status: "scheduled",
      outcomeTag: "",
    };
    this.#interviews.set(interview.interviewId, interview);
    application.state = "interview-scheduled";
    application.updatedAt = new Date().toISOString();
    return { ok: true, interview: { ...interview }, application: structuredClone(application) };
  }

  decide(applicationId, decision) {
    const application = this.#applications.get(applicationId);
    if (!application) return { ok: false, error: "visa_application_not_found" };
    if (!["approved", "refused"].includes(decision))
      return { ok: false, error: "invalid_visa_decision" };

    application.state = decision;
    application.updatedAt = new Date().toISOString();
    return { ok: true, application: structuredClone(application) };
  }

  issuePermit(applicationId, input) {
    const application = this.#applications.get(applicationId);
    if (!application) return { ok: false, error: "visa_application_not_found" };
    if (application.state !== "approved") return { ok: false, error: "visa_application_not_approved" };

    const type = String(input?.type || "").trim();
    if (!PERMIT_TYPES.has(type)) return { ok: false, error: "invalid_permit_type" };

    const months = Math.min(120, Math.max(1, Math.trunc(Number(input?.validMonths) || 12)));
    const starts = Date.now();
    const permit = {
      permitId: randomUUID(),
      personEntityId: application.personEntityId,
      countryId: application.destinationCountryId,
      type,
      sourceApplicationId: applicationId,
      startsAt: new Date(starts).toISOString(),
      expiresAt: new Date(starts + months * 30 * 24 * 60 * 60 * 1000).toISOString(),
      active: true,
    };
    this.#permits.set(permit.permitId, permit);
    return { ok: true, permit: { ...permit } };
  }

  assignBorderOfficer(input) {
    const officerEntityId = String(input?.officerEntityId || "").trim();
    const borderPointId = String(input?.borderPointId || "").trim();
    if (!officerEntityId || !borderPointId)
      return { ok: false, error: "invalid_border_officer_assignment" };

    const assignment = {
      assignmentId: randomUUID(),
      officerEntityId,
      borderPointId,
      shiftTag: String(input?.shiftTag || "standard").slice(0, 40),
      active: true,
    };
    this.#borderAssignments.set(assignment.assignmentId, assignment);
    return { ok: true, assignment: { ...assignment } };
  }

  recordEntryExit(input) {
    const personEntityId = String(input?.personEntityId || "").trim();
    const countryId = String(input?.countryId || "").trim();
    const borderPointId = String(input?.borderPointId || "").trim();
    const direction = String(input?.direction || "").trim();
    if (!personEntityId || !COUNTRIES.has(countryId) || !borderPointId || !["entry", "exit"].includes(direction))
      return { ok: false, error: "invalid_entry_exit_record" };

    const record = {
      recordId: randomUUID(),
      personEntityId,
      countryId,
      borderPointId,
      direction,
      travelDocumentId: String(input?.travelDocumentId || "").trim(),
      officerEntityId: String(input?.officerEntityId || "").trim(),
      recordedAt: new Date().toISOString(),
    };
    this.#entryExit.set(record.recordId, record);
    return { ok: true, record: { ...record } };
  }
}
