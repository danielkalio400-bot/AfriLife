import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { FirstNeighborhoodPrototypeReference as Loop,
 firstNeighborhoodPrototypeContract as contract
} from "../src/services/first-neighborhood-prototype.mjs";
const root=new URL("../../GameClient/StarterAssets/Assets/_AfriLife/",import.meta.url);
const cs=p=>readFileSync(new URL(p,root),"utf8");
test("scripted demo matches daily-life requirements and cannot auto-clear Phase 43 QA gate",()=>{
 const daily=JSON.parse(readFileSync(new URL("../../Shared/contracts/daily-life-loop.json",import.meta.url),"utf8"));
 assert.deepEqual(contract.steps,daily.steps);
 assert.match(contract.gating,/DOES NOT clear/);
 assert.match(cs("Gameplay/FirstNeighborhood/FirstNeighborhoodPrototypeLoop.cs"),/DefaultInteractionRegistry.Create\(\)/);
 assert.match(cs("Gameplay/FirstNeighborhood/FirstNeighborhoodPrototypeLoop.cs"),/Wallet.TryDebit/);
 assert.match(cs("Core/Save/WorldSaveData.cs"),/FirstNeighborhoodPrototypeState FirstNeighborhoodPrototype/);
});
test("economy debits once, income follows work, save & reload required",()=>{
 const loop=new Loop();
 assert.equal(loop.action("pay-bills").error,"out_of_order");
 for(const step of contract.steps.slice(0,-1))assert.equal(loop.action(step).ok,true,step);
 assert.equal(loop.balance,5000-200+900-350-400);
 assert.equal(loop.shifts,1);
 assert.equal(loop.groceries,1);
 assert.equal(loop.mobileData,100);
 assert.equal(loop.action("save-and-reload").error,"reload_required");
 assert.equal(loop.next,16);
 const s=loop.save();
 const fresh=new Loop();
 assert.equal(fresh.reload(s).completed,true);
 assert.equal(fresh.days,1);
 assert.equal(fresh.balance,loop.balance);
 assert.equal(fresh.action("work").error,"out_of_order");
});
test("reload rejects invalid/incomplete snapshots",()=>{
 const loop=new Loop();
 assert.equal(loop.reload('{"next":999,"completed":[]}').error,"invalid_checkpoint");
 assert.equal(loop.reload('{"next":3,"completed":[]}').error,"invalid_checkpoint");
});
test("editor creates original non-overwriting primitive scene and safe-area HUD",()=>{
 const editor=cs("Editor/FirstNeighborhoodPrototypeSceneBuilder.cs");
 assert.match(editor,/File.Exists\(path\)/);
 assert.match(editor,/Build First Neighborhood Prototype Scene/);
 assert.match(editor,/GameObject.CreatePrimitive/);
 const hud=cs("Gameplay/FirstNeighborhood/FirstNeighborhoodPrototypeHud.cs");
 assert.match(hud,/Screen.safeArea/);
 assert.match(hud,/LocalWorldSaveStore.Save/);
 assert.match(hud,/LocalWorldSaveStore.LoadOrCreate/);
 assert.match(hud,/Save & reload to finish day/);
});
