import test from "node:test";
import assert from "node:assert/strict";
import { NigeriaExpansionPlanningService } from "../src/services/nigeria-expansion-planning.mjs";
import {
 nigeriaExpansionContract, nigeriaCityCatalog, nigeriaWorldReference,
 nigeriaDailyLife,nigeriaFirstNeighborhood
} from "../src/nigeria-expansion-contracts.mjs";
import { makeServer } from "../src/server.mjs";

const newService = reviewers => new NigeriaExpansionPlanningService({
 contract:nigeriaExpansionContract,catalog:nigeriaCityCatalog,
 nigeriaReference:nigeriaWorldReference,dailyLife:nigeriaDailyLife,
 firstNeighborhood:nigeriaFirstNeighborhood,approvedReviewerIds:reviewers
});
test("Phase 43 plans 6 distinct Nigerian cities without claiming built city scenes",()=>{
 const service=newService();
 const plans=service.plans();
 assert.equal(plans.length,6);
 assert.deepEqual(plans.map(p=>p.cityId),nigeriaWorldReference.priorityCities);
 assert.ok(plans.every(p=>p.countryId==="Nigeria" && p.activationStatus==="not-playable"));
 assert.ok(plans.every(p=>p.preparationStatus==="blocked-by-neighborhood-gate"));
 assert.equal(service.plans("Ghana").length,0);
 assert.equal(service.plan("Accra"),null);
});
test("build-order gate requires every life action, service and platform test",()=>{
 const service=newService(["reviewer"]);
 const gate=service.readiness();
 assert.equal(gate.gateSatisfied,false);
 assert.equal(gate.passedCount,0);
 assert.ok(gate.missing.includes("life:save-and-reload"));
 assert.ok(gate.missing.includes("system:persistent-npcs"));
 assert.ok(gate.missing.includes("unity-windows"));
 assert.equal(service.qaAdapter("public").error,"unapproved_qa_reviewer");
 const adapter=service.qaAdapter("reviewer").adapter;
 for(const requirementId of gate.missing) {
   const result=adapter.record({requirementId,evidenceRef:"review-proof-"+requirementId,verdict:"pass"});
   assert.equal(result.ok,true);
 }
 assert.equal(service.readiness().gateSatisfied,true);
 assert.equal(service.report("Kano").actualUnitySceneValidated,false);
 assert.equal(service.plan("Kano").activationStatus,"not-playable");
});
test("evidence fail supersedes a pass, and only review-approved keys can be recorded",()=>{
 const service=newService(["qa"]);
 const adapter=service.qaAdapter("qa").adapter;
 const args={requirementId:"unity-ios",evidenceRef:"verified-report-1",verdict:"pass"};
 assert.equal(adapter.record(args).ok,true);
 assert.equal(adapter.record(args).replay,true);
 assert.equal(adapter.record({...args,evidenceRef:"new-report",verdict:"fail"}).ok,true);
 assert.ok(service.readiness().failing.includes("unity-ios"));
 assert.equal(adapter.record({...args,requirementId:"unknown"}).error,"invalid_expansion_evidence");
});
test("source catalog remains unchanged and Ghana priorities are preserved",()=>{
 const before=JSON.stringify(nigeriaCityCatalog);
 const service=newService();
 const row=service.plan("Ibadan");
 row.economyTags.push("fake-generated-sector");
 assert.equal(service.plan("Ibadan").economyTags.includes("fake-generated-sector"),false);
 assert.equal(JSON.stringify(nigeriaCityCatalog),before);
 assert.deepEqual(nigeriaCityCatalog.countries.Ghana,
   ["Accra","Kumasi","Tema","Takoradi","Tamale","Cape Coast"]);
});
test("default HTTP API is read-only and cannot fabricate certification",async t=>{
 const server=makeServer();
 await new Promise(r=>server.listen(0,"127.0.0.1",r));
 t.after(()=>server.close());
 const base="http://127.0.0.1:"+server.address().port;
 const gate=await fetch(base+"/v1/dev/nigeria-expansion/gate");
 assert.equal((await gate.json()).gateSatisfied,false);
 const planned=await fetch(base+"/v1/dev/nigeria-expansion/cities");
 assert.equal((await planned.json()).plans.length,6);
 const post=await fetch(base+"/v1/dev/nigeria-expansion/gate",{
   method:"POST",headers:{"content-type":"application/json"},
   body:JSON.stringify({gateSatisfied:true})});
 assert.equal(post.status,403);
 const gh=await fetch(base+"/v1/dev/nigeria-expansion/cities/Accra");
 assert.equal(gh.status,404);
});
