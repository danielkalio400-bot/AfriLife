import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {FirstNeighborhoodSaveRecoveryReference as Recovery}
 from "../src/services/first-neighborhood-save-recovery-reference.mjs";
import {completedSteps,completeFirstNeighborhoodDay as complete}
 from "../src/services/first-neighborhood-day-completion-reference.mjs";

const before=()=>({
 header:{schemaVersion:1,worldId:"day-43"},
 player:{wallet:4150,cityId:"Lagos",countryId:"Nigeria"},
 firstNeighborhoodPrototype:{
  scenarioId:"lagos-first-district-prototype",daysCompleted:0,
  nextStep:16,completedSteps:completedSteps.slice(0,16),
  elapsedWorldSeconds:46000,discoveredSiteIds:["home","market"],
  waitingSessionsDay:0,waitingSessionsToday:2,errandReceipts:[]
 }
});

test("final day advances exactly once and preserves wallet, landmarks, and wait history",()=>{
 const store=new Recovery();
 assert.equal(store.write(before()).ok,true);
 const result=complete(store);
 assert.equal(result.ok,true);
 assert.equal(result.world.firstNeighborhoodPrototype.nextStep,17);
 assert.equal(result.world.firstNeighborhoodPrototype.daysCompleted,1);
 assert.equal(result.world.firstNeighborhoodPrototype.completedSteps.length,17);
 assert.equal(result.world.player.wallet,4150);
 assert.deepEqual(result.world.firstNeighborhoodPrototype.discoveredSiteIds,
   ["home","market"]);
 assert.equal(result.world.firstNeighborhoodPrototype.waitingSessionsToday,2);
 assert.equal(store.read().generation,2);
 assert.equal(complete(store).error,"incomplete_day");
 assert.equal(store.read().generation,2);
});
test("interrupted save cannot mark a day as completed or alter verified world",()=>{
 const store=new Recovery();store.write(before());
 const failed=complete(store,{interruptAfterStage:true});
 assert.equal(failed.error,"checkpoint_write_failed");
 assert.equal(store.read().world.firstNeighborhoodPrototype.nextStep,16);
 assert.equal(store.read().world.firstNeighborhoodPrototype.daysCompleted,0);
 assert.equal(store.read().generation,1);
 const recovered=complete(store);
 assert.equal(recovered.ok,true);
 assert.equal(recovered.world.firstNeighborhoodPrototype.daysCompleted,1);
});
test("wrong world, corrupted readback and mismatched day are not accepted",()=>{
 const store=new Recovery();store.write(before());
 const initial=store.read().world;
 const returningOld={
  read:()=>({ok:true,world:structuredClone(initial),generation:1}),
  write:()=>({ok:true})
 };
 assert.equal(complete(returningOld).error,"checkpoint_readback_failed");
 const swapped={
  readCalls:0,
  read(){this.readCalls++;return {ok:true,world:this.readCalls===1
   ?structuredClone(initial):{...structuredClone(initial),
      header:{schemaVersion:1,worldId:"other"}}}},
  write:()=>({ok:true})
 };
 assert.equal(complete(swapped).error,"checkpoint_readback_failed");
});
test("malformed completed step sequence fails before writing",()=>{
 const store=new Recovery();
 const invalid=before();invalid.firstNeighborhoodPrototype.completedSteps[4]="sleep";
 assert.equal(store.write(invalid).error,"invalid-world");
 assert.equal(complete(store).error,"prior_checkpoint_unavailable");
});
test("Unity candidate is never installed into live HUD until a verified disk readback",()=>{
 const root=new URL("../../GameClient/StarterAssets/Assets/_AfriLife/",import.meta.url);
 const read=p=>readFileSync(new URL(p,root),"utf8");
 const day=read("Gameplay/FirstNeighborhood/FirstNeighborhoodDayCompletionCheckpoint.cs");
 assert.match(day,/Action<WorldSaveData> save/);
 assert.match(day,/Func<WorldSaveData> reload/);
 assert.ok(day.indexOf("save(candidate.SaveData)")<day.indexOf("WorldSaveData verified=reload()"));
 assert.match(day,/DaysCompleted!=oldDayCount\+1/);
 assert.match(day,/FirstNeighborhoodSaveIntegrity.Check\(verified,out _\)/);
 const hud=read("Gameplay/FirstNeighborhood/FirstNeighborhoodPrototypeHud.cs");
 assert.match(hud,/SavePlayerPosition\(\) && TryLoadWorld/);
 assert.match(hud,/FirstNeighborhoodDayCompletionCheckpoint.TryCommit\(/);
 assert.match(hud,/if\(_saveVerified\)\s*\{\s*_loop=completed;/);
 assert.doesNotMatch(hud,/_saveVerified=_loop.CompleteAfterVerifiedReload/);
 const save=read("Core/Save/LocalWorldSaveStore.cs");
 const validate=save.indexOf("if(!ValidWorld(save))",save.indexOf("public static void Save("));
 const normalize=save.indexOf("save.Normalize()",save.indexOf("public static void Save("));
 assert.ok(validate>0 && normalize>validate);
});
