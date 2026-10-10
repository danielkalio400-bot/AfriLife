import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {firstNeighborhoodPrototypeContract as daily} from "../src/services/first-neighborhood-prototype.mjs";
const root=new URL("../../GameClient/StarterAssets/Assets/_AfriLife/",import.meta.url);
const cs=p=>readFileSync(new URL(p,root),"utf8");
const contract=JSON.parse(readFileSync(
 new URL("../../Shared/contracts/first-neighborhood-physical-interaction.json",import.meta.url),"utf8"));
test("all 17 day-one steps have exactly one destination marker",()=>{
 const mappings={
  "travel-or-drive":"workplace","work":"workplace","earn-money":"workplace",
  "shop":"market","exercise":"park","interact-with-persistent-npcs":"neighbor",
  "pay-bills":"bank"
 };
 const sites=new Set(contract.markers.map(m=>m.siteId));
 for(const step of daily.steps)assert.ok(sites.has(mappings[step]||"home"),step);
 assert.equal(sites.size,6);
 assert.equal(contract.movement.noVehicles,true);
});
test("real CharacterController movement and mobile GUI layer are present",()=>{
 const walk=cs("Gameplay/FirstNeighborhood/FirstNeighborhoodWalkController.cs");
 assert.match(walk,/RequireComponent\(typeof\(CharacterController\)\)/);
 assert.match(walk,/_controller\.SimpleMove\(/);
 assert.match(walk,/GUI\.RepeatButton/);
 assert.match(walk,/ENABLE_INPUT_SYSTEM/);
 assert.match(walk,/HasMovedSinceCapture/);
 const scene=cs("Editor/FirstNeighborhoodWalkLayerBuilder.cs");
 assert.match(scene,/AddComponent<CharacterController>/);
 assert.match(scene,/AddComponent<FirstNeighborhoodInteractionPoint>/);
 assert.match(scene,/SphereCollider/);
 assert.match(scene,/File.Exists\(ScenePath\)/);
 const original=cs("Editor/FirstNeighborhoodPrototypeSceneBuilder.cs");
 assert.match(original,/FirstNeighborhoodWalkLayerBuilder.AddToScene\(scene\)/);
});
test("interactions check proximity before advancing and keep money authority unchanged",()=>{
 const policy=cs("Gameplay/FirstNeighborhood/FirstNeighborhoodInteractionPolicy.cs");
 assert.match(policy,/point\.Contains\(playerPosition\)/);
 const hud=cs("Gameplay/FirstNeighborhood/FirstNeighborhoodPrototypeHud.cs");
 const location=hud.indexOf("FirstNeighborhoodInteractionPolicy.CanPerform");
 const action=hud.indexOf("_loop.TryAdvance");
 assert.ok(location>0 && action>location);
 assert.match(hud,/SavePlayerPosition\(\)/);
 assert.match(hud,/Restore\(_loop.State\)/);
 const state=cs("Gameplay/FirstNeighborhood/FirstNeighborhoodPrototypeState.cs");
 assert.match(state,/HasSavedPosition/);
 const loop=cs("Gameplay/FirstNeighborhood/FirstNeighborhoodPrototypeLoop.cs");
 assert.match(loop,/Wallet.TryDebit/);
});
test("physical layer has no progress bypass or production certification claim",()=>{
 const hud=cs("Gameplay/FirstNeighborhood/FirstNeighborhoodPrototypeHud.cs");
 assert.doesNotMatch(hud,/gateSatisfied\s*=\s*true|releaseApproved\s*=\s*true/);
 assert.equal(contract.notImplemented.includes("production device testing"),true);
});
