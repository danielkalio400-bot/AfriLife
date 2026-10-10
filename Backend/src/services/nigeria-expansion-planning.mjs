const clone = value => structuredClone(value);
const allowedEvidence = new Set(["pass","fail"]);
const clean = value => typeof value==="string" && value.length>0 && value.length<=160 &&
  value.trim()===value && [...value].every(c=>c.charCodeAt(0)>=32);

/**
 * Phased expansion readiness, not world generation.
 * The base game has NOT passed editor/device save-load tests; in production
 * the QA evidence provider must be independently authorized.
 */
export class NigeriaExpansionPlanningService {
  #contract;
  #requirements;
  #reports = new Map();
  #reviewers;
  #clock;

  constructor({ contract, catalog, nigeriaReference, firstNeighborhood, dailyLife,
    approvedReviewerIds = [], clock = () => new Date().toISOString() }) {
    const expected = catalog?.countries?.Nigeria;
    const priority = nigeriaReference?.priorityCities;
    if (!Array.isArray(expected) || !Array.isArray(priority) ||
        priority.length!==contract?.profiles?.length ||
        [...priority].sort().join("|")!==[...contract.priorityCityIds].sort().join("|") ||
        new Set(contract.priorityCityIds).size!==contract.priorityCityIds.length ||
        !contract.profiles.every(p => priority.includes(p.cityId) &&
          expected.some(c => c.replaceAll(" ","")===p.cityId))) {
      throw new Error("nigeria_city_source_mismatch");
    }
    const requirements = [
      ...dailyLife.steps.map(step => "life:"+step),
      ...firstNeighborhood.requiredRuntimeSystems.map(name => "system:"+name),
      ...contract.qaExtraEvidence
    ];
    if(new Set(requirements).size!==requirements.length)throw new Error("duplicate_expansion_requirement");
    this.#contract=clone(contract);
    this.#requirements=requirements;
    this.#reviewers=new Set(approvedReviewerIds);
    this.#clock=clock;
  }

  qaAdapter(reviewerId) {
    if(!clean(reviewerId)||!this.#reviewers.has(reviewerId))
      return {ok:false,error:"unapproved_qa_reviewer"};
    return {ok:true,adapter:Object.freeze({
      record: input=>this.#record(reviewerId,input)
    })};
  }

  #record(reviewerId,input) {
    const {requirementId,evidenceRef,verdict}=input||{};
    if(!this.#requirements.includes(requirementId) || !clean(evidenceRef) ||
      !allowedEvidence.has(verdict))
      return {ok:false,error:"invalid_expansion_evidence"};
    const previous=this.#reports.get(requirementId);
    if(previous && previous.evidenceRef===evidenceRef &&
      previous.verdict===verdict && previous.reviewerId===reviewerId)
      return {ok:true,report:clone(previous),replay:true};
    // New evidence supersedes an earlier assessment; only QA identities
    // preconfigured in the process can file one.
    const report={requirementId,evidenceRef,verdict,reviewerId,
      testedAt:this.#clock(),category:requirementId.split(":")[0]};
    this.#reports.set(requirementId,report);
    return {ok:true,report:clone(report),replay:false};
  }

  readiness() {
    const passed=this.#requirements.filter(id=>this.#reports.get(id)?.verdict==="pass");
    const failing=this.#requirements.filter(id=>this.#reports.get(id)?.verdict==="fail");
    const missing=this.#requirements.filter(id=>!this.#reports.has(id));
    return {
      milestone:"first-serious-playable-neighborhood",
      totalRequirements:this.#requirements.length,
      passedCount:passed.length,
      passed, failing, missing,
      gateSatisfied:passed.length===this.#requirements.length,
      releaseApproved:false,
      explanation:"Gate tracks internal QA evidence only; city scene/content activation is a separate Unity milestone."
    };
  }

  plans(countryId="Nigeria") {
    if(countryId!=="Nigeria")return [];
    const gate=this.readiness();
    return this.#contract.profiles.map(profile => ({
      ...clone(profile), countryId:"Nigeria",currency:"NGN",
      activationStatus:"not-playable",
      preparationStatus:gate.gateSatisfied?"ready-for-editor-review":"blocked-by-neighborhood-gate",
      missingPrerequisites:gate.missing.length+gate.failing.length,
      nextStep:"author-real-Unity-city-content-and-validate-streaming"
    }));
  }

  plan(cityId) {
    return this.plans().find(item=>item.cityId===cityId)||null;
  }

  report(cityId) {
    const city=this.plan(cityId);
    if(!city)return null;
    const gate=this.readiness();
    return {
      city, firstNeighborhood:gate, simulatedAssetsBuilt:false,
      actualUnitySceneValidated:false,
      activeWorldCity:false,
      integrationBoundaries:{
        cities:"existing-country-and-city-catalog",
        transport:"shared-transit-and-traffic-systems",
        economy:"shared-banking-jobs-and-inventory-systems",
        weather:"existing-weather-environment",
        saves:"existing-local-world-save-store"
      }
    };
  }
}
