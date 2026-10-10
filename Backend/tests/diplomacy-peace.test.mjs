import test from "node:test";
import assert from "node:assert/strict";
import { DiplomacyPeaceService } from "../src/services/diplomacy-peace.mjs";
import { GovernmentService } from "../src/services/government.mjs";
import { NewsMediaService } from "../src/services/news-media.mjs";
import { diplomacyPeaceContract } from "../src/diplomacy-contracts.mjs";
import { makeServer } from "../src/server.mjs";

function scenario(){
 const government=new GovernmentService();
 const media=new NewsMediaService();
 const diplomacy=new DiplomacyPeaceService({government,media});
 return {government,media,diplomacy};
}
function ratify(world,phase,scopes=[]){
 const requestId="proposal-"+phase;
 const result=world.diplomacy.propose({actorCountryId:"Nigeria",requestId,toPhase:phase,scopes});
 assert.equal(result.ok,true,JSON.stringify(result));
 assert.equal(world.diplomacy.relation().phase,
   ({dispute:"normal",restrictions:"dispute",talks:"restrictions",ceasefire:"talks",
     agreement:"ceasefire",reopening:"agreement",restored:"reopening"})[phase]);
 const done=world.diplomacy.decide({actorCountryId:"Ghana",proposalId:result.proposal.proposalId,
   decisionId:"decision-"+phase,approve:true});
 assert.equal(done.ok,true);
 assert.equal(done.proposal.status,"ratified");
 assert.equal(world.diplomacy.relation().phase,phase);
 return done;
}
test("Phase 42 relation is fictional and bilateral by default",()=>{
 const {diplomacy}=scenario();
 assert.deepEqual(diplomacy.relation().countries,["Nigeria","Ghana"]);
 assert.equal(diplomacy.relation().phase,"normal");
 assert.equal(diplomacyPeaceContract.fictional,true);
 assert.equal(diplomacy.propose({actorCountryId:"Other",requestId:"x",toPhase:"dispute",scopes:[]}).error,"invalid_diplomatic_proposal");
});
test("each step requires approvals by both partners and blocks illegal skips",()=>{
 const world=scenario();
 assert.equal(world.diplomacy.propose({actorCountryId:"Nigeria",requestId:"skip",
   toPhase:"ceasefire",scopes:[]}).error,"invalid_diplomatic_transition");
 const proposal=world.diplomacy.propose({actorCountryId:"Nigeria",requestId:"one",
   toPhase:"dispute",scopes:[]});
 assert.equal(proposal.ok,true);
 assert.equal(world.diplomacy.relation().phase,"normal");
 assert.equal(world.diplomacy.decide({actorCountryId:"Nigeria",
   proposalId:proposal.proposal.proposalId,decisionId:"self",approve:true}).error,"country_already_approved");
 const change=world.diplomacy.decide({actorCountryId:"Ghana",
   proposalId:proposal.proposal.proposalId,decisionId:"approve",approve:true});
 assert.equal(change.relation.phase,"dispute");
 assert.equal(world.diplomacy.decide({actorCountryId:"Ghana",
   proposalId:proposal.proposal.proposalId,decisionId:"approve",approve:true}).replay,true);
 assert.equal(world.diplomacy.propose({actorCountryId:"Nigeria",requestId:"one",
   toPhase:"dispute",scopes:[]}).replay,true);
 assert.equal(world.diplomacy.propose({actorCountryId:"Nigeria",requestId:"one",
   toPhase:"restrictions",scopes:[]}).error,"diplomatic_request_conflict");
});
test("refusal leaves the original state unchanged and enables a new proposal",()=>{
 const world=scenario();
 const proposal=world.diplomacy.propose({actorCountryId:"Ghana",requestId:"r",
   toPhase:"dispute",scopes:[]});
 const rejected=world.diplomacy.decide({actorCountryId:"Nigeria",
   proposalId:proposal.proposal.proposalId,decisionId:"no",approve:false});
 assert.equal(rejected.proposal.status,"rejected");
 assert.equal(world.diplomacy.relation().phase,"normal");
 assert.equal(world.diplomacy.propose({actorCountryId:"Ghana",requestId:"r2",
   toPhase:"dispute",scopes:[]}).ok,true);
});
test("fictional trade route restrictions reopen after peace and neutral media follows",()=>{
 const world=scenario();
 ratify(world,"dispute");
 ratify(world,"restrictions",["border","trade","maritime"]);
 assert.equal(world.diplomacy.relation().routeAccess.trade,false);
 for(const phase of ["talks","ceasefire","agreement","reopening","restored"])
   ratify(world,phase);
 assert.equal(world.diplomacy.relation().routeAccess.border,true);
 assert.equal(world.diplomacy.relation().civilianRelief01,1);
 assert.equal(world.diplomacy.relation().revision,7);
 assert.ok(world.media.feed({countryId:"Ghana",topic:"peace-talks"}).length>=4);
 assert.ok(world.media.feed({countryId:"Nigeria",topic:"peace-talks"}).length>=4);
});
test("reconstruction requires agreement and reuses approved public spending cap",()=>{
 const world=scenario();
 const countryId="Ghana",regionId="FictionalCoastalDistrict";
 const early=world.diplomacy.fundReconstruction({countryId,requestId:"x",
   regionId,budgetId:"none",agencyId:"none",amountMinorUnits:100});
 assert.equal(early.error,"peace_agreement_required");
 for(const phase of ["dispute","restrictions","talks","ceasefire","agreement"])
   ratify(world,phase,phase==="restrictions"?["travel"]:[]);
 const agency=world.government.registerAgency({countryId,displayName:"Fictional Reconstruction Office"}).agency;
 const budget=world.government.createBudget({countryId,fiscalPeriod:"fy-1",
   plannedSpendingMinorUnits:1000}).budget;
 world.government.approveBudget(budget.budgetId,1000);
 const input={countryId,regionId,agencyId:agency.agencyId,budgetId:budget.budgetId,
   amountMinorUnits:800,requestId:"rebuild-1"};
 const funded=world.diplomacy.fundReconstruction(input);
 assert.equal(funded.ok,true);
 assert.equal(funded.reconstruction.currency,"GHS");
 assert.equal(world.diplomacy.fundReconstruction(input).replay,true);
 assert.equal(world.diplomacy.fundReconstruction({...input,amountMinorUnits:100}).error,
   "reconstruction_request_conflict");
 assert.equal(world.diplomacy.fundReconstruction({...input,requestId:"rebuild-2",
   amountMinorUnits:300}).error,"public_spending_exceeds_budget");
 assert.equal(world.diplomacy.reconstruction("Ghana").length,1);
 assert.equal(world.diplomacy.reconstruction("Nigeria").length,0);
});
test("local API serves bilateral negotiation and empty recovery read model",async t=>{
 const server=makeServer();
 await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
 t.after(()=>server.close());
 const base="http://127.0.0.1:"+server.address().port;
 const proposal=await fetch(base+"/v1/dev/diplomacy/proposals",{
   method:"POST",headers:{"content-type":"application/json"},
   body:JSON.stringify({actorCountryId:"Nigeria",requestId:"a",toPhase:"dispute",scopes:[]})
 });
 assert.equal(proposal.status,200);
 const info=await proposal.json();
 const approval=await fetch(base+"/v1/dev/diplomacy/decisions",{
   method:"POST",headers:{"content-type":"application/json"},
   body:JSON.stringify({actorCountryId:"Ghana",proposalId:info.proposal.proposalId,
     decisionId:"agree",approve:true})
 });
 assert.equal((await approval.json()).relation.phase,"dispute");
 const contract=await fetch(base+"/v1/runtime/diplomacy-peace");
 assert.equal((await contract.json()).bulk,30);
});
