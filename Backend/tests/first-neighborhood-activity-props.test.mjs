import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {activityProps,checkPhysicalAction}
 from "../src/services/first-neighborhood-activity-props-reference.mjs";
import {firstNeighborhoodPrototypeContract} from "../src/services/first-neighborhood-prototype.mjs";
const root=new URL("../../GameClient/StarterAssets/Assets/_AfriLife/",import.meta.url);
const unity=path=>readFileSync(new URL(path,root),"utf8");
test("all 17 scripted daily-life steps have unique authored prop",()=>{
 for(const step of firstNeighborhoodPrototypeContract.steps){
   const props=activityProps.filter(item=>item.steps.includes(step));
   assert.equal(props.length,1,step);
 }
 assert.equal(new Set(activityProps.map(p=>p.id)).size,activityProps.length);
});
test("actions require avatar, site and specific physical object",()=>{
 assert.equal(checkPhysicalAction("shower",null).error,"player_controller_required");
 assert.equal(checkPhysicalAction("shower",{x:0,z:0}).error,"destination_not_reached");
 assert.equal(checkPhysicalAction("shower",{x:-11,z:-6.5}).ok,true);
 const different=activityProps.filter(p=>p.id!=="home-sink");
 assert.equal(checkPhysicalAction("shower",{x:-11,z:-6.5},different).error,
   "activity_prop_missing");
 assert.equal(checkPhysicalAction("pay-bills",{x:-7,z:7.3}).ok,true);
 assert.equal(checkPhysicalAction("work",{x:10,z:4.8}).ok,true);
});
test("Unity HUD never skips site or prop gate when player controller is missing",()=>{
 const hud=unity("Gameplay/FirstNeighborhood/FirstNeighborhoodPrototypeHud.cs");
 assert.match(hud,/FirstNeighborhoodPhysicalActionGate.CanPerform/);
 assert.doesNotMatch(hud,/_actor!=null &&\s*!FirstNeighborhoodInteractionPolicy.CanPerform\(/);
 const gate=unity("Gameplay/FirstNeighborhood/FirstNeighborhoodPhysicalActionGate.cs");
 assert.match(gate,/if\(actor==null\)/);
 assert.match(gate,/prop.Supports\(step\) && prop.Contains\(actor.transform.position\)/);
});
test("Editor builder and scene validator include physical props without duplicate creation",()=>{
 const build=unity("Editor/FirstNeighborhoodWalkLayerBuilder.cs");
 const inspect=unity("Editor/FirstNeighborhoodSceneValidator.cs");
 assert.match(build,/AddActivityProps\(\)/);
 assert.match(build,/GameObject.Find\(name\)/);
 assert.match(inspect,/Expected one activity prop for/);
 assert.match(inspect,/FirstNeighborhoodPrototypeLoop.Steps/);
});
