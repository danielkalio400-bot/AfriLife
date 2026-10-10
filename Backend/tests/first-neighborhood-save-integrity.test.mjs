import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {FirstNeighborhoodSaveRecoveryReference as Store,validateFirstNeighborhoodLedger}
 from "../src/services/first-neighborhood-save-recovery-reference.mjs";
const base=(id="world-37")=>({header:{schemaVersion:1,worldId:id},
 player:{money:10000},firstNeighborhoodPrototype:{
  scenarioId:"lagos-first-district-prototype",nextStep:2,daysCompleted:0,
  completedSteps:["wake","shower"],errandReceipts:[],
  conversationResidentIds:["prototype-resident-ada"],conversationCounts:[1]
 }});
const receipt={errandId:"park-cleanup",siteId:"park",completedDay:0,
 walletBalanceAfterMinorUnits:10000};
test("valid receipts and canonical progression survive verified slot reload",()=>{
 const s=new Store(),world=base();
 world.firstNeighborhoodPrototype.errandReceipts.push(receipt);
 assert.equal(validateFirstNeighborhoodLedger(world).ok,true);
 assert.equal(s.write(world).ok,true);
 assert.equal(s.read().world.firstNeighborhoodPrototype.errandReceipts.length,1);
});
test("duplicate receipts, invalid sites, and out-of-order steps are rejected despite checksum",()=>{
 const s=new Store(),w=base();
 w.firstNeighborhoodPrototype.errandReceipts=[receipt,structuredClone(receipt)];
 assert.equal(s.write(w).error,"invalid-world");
 s.slotA=Store.envelope(w,1);
 assert.equal(s.read().error,"unrecoverable-save");
 const wrong=base();wrong.firstNeighborhoodPrototype.completedSteps[1]="sleep";
 assert.equal(validateFirstNeighborhoodLedger(wrong).error,"invalid_daily_loop");
 const site=base();site.firstNeighborhoodPrototype.errandReceipts=[
  {...receipt,siteId:"home"}];
 assert.equal(validateFirstNeighborhoodLedger(site).error,"invalid_errand_receipt");
});
test("two valid saves with different IDs are preserved without picking an arbitrary winner",()=>{
 const s=new Store();
 s.slotA=Store.envelope(base("world-a"),2);
 s.slotB=Store.envelope(base("world-b"),3);
 assert.equal(s.read().error,"conflicting-world-identities");
 assert.equal(s.write(base("world-a")).error,"unrecoverable-save");
 assert.equal(s.slotA.generation,2);
 assert.equal(s.slotB.generation,3);
});
test("same generation, different payload is rejected; one corrupt slot can still be recovered",()=>{
 const s=new Store();
 s.slotA=Store.envelope(base(),2);
 s.slotB=Store.envelope({...base(),player:{money:3}},2);
 assert.equal(s.read().error,"conflicting-save-generations");
 s.slotB.sha256="damaged";
 assert.equal(s.read().world.header.worldId,"world-37");
});
test("Unity source checks semantics BEFORE normalizing and refuses a conflicting world",()=>{
 const root=new URL("../../GameClient/StarterAssets/Assets/_AfriLife/",import.meta.url);
 const c=p=>readFileSync(new URL(p,root),"utf8");
 const source=c("Core/Save/FirstNeighborhoodSaveIntegrity.cs");
 const save=c("Core/Save/LocalWorldSaveStore.cs");
 assert.match(source,/CompletedSteps/);
 assert.match(source,/FirstNeighborhoodPrototypeLoop.Steps\[i\]/);
 assert.match(source,/HashSet<string>/);
 assert.match(source,/duplicate-errand-receipt/);
 assert.match(source,/float.IsNaN\(state.PlayerX\)/);
 assert.match(save,/FirstNeighborhoodSaveIntegrity.Check\(world,out _\)/);
 assert.match(save,/different world IDs/);
 assert.match(save,/conflicting content for the same generation/);
});
