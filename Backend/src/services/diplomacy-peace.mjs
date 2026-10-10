import { randomUUID } from "node:crypto";

const PARTNERS = ["Nigeria", "Ghana"];
const VALID_COUNTRIES = new Set(PARTNERS);
const STATES = ["normal", "dispute", "restrictions", "talks", "ceasefire",
  "agreement", "reopening", "restored"];
const STEPS = Object.freeze({
  normal:"dispute", dispute:"restrictions", restrictions:"talks",
  talks:"ceasefire", ceasefire:"agreement", agreement:"reopening",
  reopening:"restored", restored:"dispute"
});
const VALID_SCOPES = new Set(["trade", "border", "maritime", "travel"]);
const scrub = (s, max=120) => typeof s==="string" && s.trim()===s &&
  s.length>0 && s.length<=max && [...s].every(c=>c.charCodeAt(0)>=32);
const validAmount = n => Number.isSafeInteger(n) && n>0;
const copy = value => structuredClone(value);
const bad = error => ({ok:false,error});

/**
 * Fictional bilateral negotiation and reconstruction simulation, without
 * territorial claims, real election/policy assertions, tactical operations
 * or instructions for conflict. Mutations require explicit bilateral consent
 * *within this development simulator*; no real authentication is provided.
 */
export class DiplomacyPeaceService {
  #relations = new Map();
  #proposals = new Map();
  #requests = new Map();
  #decisions = new Map();
  #reconstruction = new Map();
  #fundRequests = new Map();
  #government;
  #media;
  #outlets = new Map();
  #clock;

  constructor({ government, media, clock = () => new Date().toISOString() }) {
    if (!government || typeof government.recordSpending!=="function" ||
        typeof government.createProject!=="function" || !media ||
        typeof media.publish!=="function") throw new Error("peace_dependencies_required");
    this.#government = government;
    this.#media = media;
    this.#clock = clock;
    this.#relations.set("Nigeria-Ghana", {
      relationId:"Nigeria-Ghana",countries:[...PARTNERS],
      phase:"normal",revision:0,pendingProposalId:null,
      routeAccess:{trade:true,border:true,maritime:true,travel:true},
      civilianRelief01:1,ceasefireObserved:false,
      eventHistory:[],updatedAt:this.#clock(),fictional:true
    });
  }

  relation() { return copy(this.#relations.get("Nigeria-Ghana")); }

  #proposalFingerprint(input) {
    return JSON.stringify([input.toPhase,[...input.scopes].sort()]);
  }

  propose(input) {
    const { actorCountryId, requestId, toPhase, scopes }=input||{};
    if (!VALID_COUNTRIES.has(actorCountryId) || !scrub(requestId) ||
        !STATES.includes(toPhase) || !Array.isArray(scopes) ||
        !scopes.every(scope=>VALID_SCOPES.has(scope)) ||
        new Set(scopes).size!==scopes.length)
      return bad("invalid_diplomatic_proposal");
    const relation=this.#relations.get("Nigeria-Ghana");
    const key=actorCountryId+"|"+requestId;
    const previous=this.#requests.get(key);
    const fingerprint=this.#proposalFingerprint({toPhase,scopes});
    if (previous) return previous.fingerprint===fingerprint
      ? {ok:true,proposal:copy(this.#proposals.get(previous.proposalId)),replay:true}
      : bad("diplomatic_request_conflict");
    if (relation.pendingProposalId) return bad("diplomatic_proposal_pending");
    if (STEPS[relation.phase]!==toPhase) return bad("invalid_diplomatic_transition");
    if (toPhase==="restrictions" && scopes.length===0)
      return bad("restriction_scope_required");
    if (toPhase!=="restrictions" && scopes.length!==0)
      return bad("restriction_scope_not_allowed");
    const proposal={
      proposalId:randomUUID(),relationId:relation.relationId,
      fromPhase:relation.phase,toPhase,scopes:[...scopes],
      proposerCountryId:actorCountryId,
      approvals:{Nigeria:actorCountryId==="Nigeria",Ghana:actorCountryId==="Ghana"},
      status:"pending",createdAt:this.#clock(),ratifiedAt:null
    };
    relation.pendingProposalId=proposal.proposalId;
    this.#proposals.set(proposal.proposalId,proposal);
    this.#requests.set(key,{fingerprint,proposalId:proposal.proposalId});
    return {ok:true,proposal:copy(proposal),replay:false};
  }

  decide(input) {
    const {actorCountryId,proposalId,decisionId,approve}=input||{};
    if (!VALID_COUNTRIES.has(actorCountryId) || !scrub(proposalId) ||
        !scrub(decisionId) || typeof approve!=="boolean")
      return bad("invalid_diplomatic_decision");
    const proposal=this.#proposals.get(proposalId);
    const relation=this.#relations.get("Nigeria-Ghana");
    if (!proposal) return bad("diplomatic_proposal_not_found");
    const key=proposalId+"|"+actorCountryId+"|"+decisionId;
    const prior=this.#decisions.get(key);
    if (prior!==undefined) return prior===approve
      ? {ok:true,proposal:copy(proposal),relation:this.relation(),replay:true}
      : bad("diplomatic_decision_conflict");
    if (proposal.status!=="pending" || relation.pendingProposalId!==proposalId)
      return bad("diplomatic_proposal_not_pending");
    if (proposal.approvals[actorCountryId]) return bad("country_already_approved");
    this.#decisions.set(key,approve);
    if (!approve) {
      proposal.status="rejected";
      relation.pendingProposalId=null;
      relation.updatedAt=this.#clock();
      return {ok:true,proposal:copy(proposal),relation:this.relation(),replay:false};
    }
    proposal.approvals[actorCountryId]=true;
    if (proposal.approvals.Nigeria && proposal.approvals.Ghana) {
      proposal.status="ratified";
      proposal.ratifiedAt=this.#clock();
      relation.phase=proposal.toPhase;
      relation.revision++;
      relation.pendingProposalId=null;
      relation.updatedAt=this.#clock();
      relation.ceasefireObserved=["ceasefire","agreement","reopening","restored"].includes(relation.phase);
      if (relation.phase==="restrictions") {
        for (const scope of proposal.scopes) relation.routeAccess[scope]=false;
        relation.civilianRelief01=0.6;
      }
      if (relation.phase==="ceasefire") relation.civilianRelief01=0.75;
      if (relation.phase==="agreement") relation.civilianRelief01=0.85;
      if (relation.phase==="reopening") {
        for (const key of Object.keys(relation.routeAccess)) relation.routeAccess[key]=true;
        relation.civilianRelief01=0.95;
      }
      if (relation.phase==="restored") relation.civilianRelief01=1;
      if (relation.phase==="dispute") {
        relation.ceasefireObserved=false;
        relation.civilianRelief01=0.95;
      }
      relation.eventHistory.push({
        revision:relation.revision,phase:relation.phase,
        tag:"fictional-bilateral-diplomacy",at:relation.updatedAt
      });
      this.#broadcast(relation);
    }
    return {ok:true,proposal:copy(proposal),relation:this.relation(),replay:false};
  }

  #broadcast(relation) {
    const topic=["talks","ceasefire","agreement","reopening","restored"].includes(relation.phase)
      ? "peace-talks" : "government-announcement";
    for (const countryId of PARTNERS) {
      let outlet=this.#outlets.get(countryId);
      if (!outlet) {
        const result=this.#media.registerOutlet({
          outletId:"fictional-peace-journal-"+countryId,
          countryId,displayName:"AfriLife Fictional Public Bulletin",
          channelType:"newspaper"
        });
        if (!result.ok) continue;
        outlet=result.outlet.outletId;
        this.#outlets.set(countryId,outlet);
      }
      this.#media.publish({
        outletId:outlet,topic,
        headlineTag:"fictional-bilateral-"+relation.phase,
        summaryTag:"simulation-only-mutually-approved-diplomacy",
        sourceSystemTag:"diplomacy-peace",
        urgency:relation.phase==="ceasefire" ? 2 : 1
      });
    }
  }

  getProposal(proposalId) {
    const result=this.#proposals.get(String(proposalId||""));
    return result?copy(result):null;
  }

  proposals() { return [...this.#proposals.values()].map(copy); }

  fundReconstruction(input) {
    const {requestId,countryId,regionId,budgetId,agencyId,amountMinorUnits}=input||{};
    if (!scrub(requestId) || !VALID_COUNTRIES.has(countryId) ||
        !scrub(regionId,80) || !scrub(budgetId) || !scrub(agencyId) ||
        !validAmount(amountMinorUnits))
      return bad("invalid_reconstruction_funding");
    const relation=this.#relations.get("Nigeria-Ghana");
    if (!["agreement","reopening","restored"].includes(relation.phase))
      return bad("peace_agreement_required");
    const key=countryId+"|"+requestId;
    const fingerprint=JSON.stringify([regionId,budgetId,agencyId,amountMinorUnits]);
    const previous=this.#fundRequests.get(key);
    if (previous) return previous.fingerprint===fingerprint
      ? {ok:true,reconstruction:copy(this.#reconstruction.get(previous.id)),replay:true}
      : bad("reconstruction_request_conflict");
    const budget=this.#government.getBudget(budgetId);
    const agency=this.#government.getAgency(agencyId);
    if (!budget || budget.status!=="approved" || budget.countryId!==countryId ||
        !agency || agency.countryId!==countryId)
      return bad("reconstruction_budget_not_authorized");
    // Reuse the government ledger. Never independently debit national
    // reserves or mint currency to fund reconstruction.
    const spending=this.#government.recordSpending({
      countryId,budgetId,agencyId,amountMinorUnits,
      purposeTag:"fictional-peace-reconstruction"
    });
    if (!spending.ok) return bad(spending.error);
    const project=this.#government.createProject({
      countryId,regionId,projectType:"fictional-reconstruction",
      approvedBudgetMinorUnits:amountMinorUnits
    });
    if (!project.ok) return bad(project.error);
    const entry={
      reconstructionId:randomUUID(),countryId,regionId,amountMinorUnits,
      budgetId,agencyId,governmentSpendingId:spending.spending.spendingId,
      governmentProjectId:project.project.projectId,
      currency:budget.currency,recordedAt:this.#clock()
    };
    this.#reconstruction.set(entry.reconstructionId,entry);
    this.#fundRequests.set(key,{fingerprint,id:entry.reconstructionId});
    return {ok:true,reconstruction:copy(entry),replay:false};
  }

  reconstruction(countryId="") {
    return [...this.#reconstruction.values()]
      .filter(item=>!countryId||item.countryId===countryId)
      .sort((a,b)=>a.reconstructionId.localeCompare(b.reconstructionId))
      .map(copy);
  }
}
