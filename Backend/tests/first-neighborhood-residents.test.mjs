import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const base=new URL("../../GameClient/StarterAssets/Assets/_AfriLife/",import.meta.url);
const read=path=>readFileSync(new URL(path,base),"utf8");
const contract=JSON.parse(readFileSync(new URL("../../Shared/contracts/first-neighborhood-residents.json",import.meta.url),"utf8"));
test("resident binds to existing persisted NPC schema and known resident id",()=>{
const director=read("Gameplay/FirstNeighborhood/FirstNeighborhoodResidentDirector.cs");
assert.match(director,/PersistentNpcs\.Find/);
assert.match(director,/PersistentNpcs\.Add/);
assert.match(director,/NpcRuntimeState/);
assert.match(director,/CanConverse\(playerPosition\)/);
assert.match(director,/LastConversationDay/);
assert.equal(contract.resident.persistentSource,"WorldSaveData.PersistentNpcs / NpcRuntimeState");
});
test("scripted conversation requires actual resident and is still gated by interaction point",()=>{
const hud=read("Gameplay/FirstNeighborhood/FirstNeighborhoodPrototypeHud.cs");
const marker=hud.indexOf("FirstNeighborhoodInteractionPolicy.CanPerform");
const resident=hud.indexOf("_resident.CanConverse");
const action=hud.indexOf("_loop.TryAdvance");
assert.ok(marker>=0&&resident>marker&&action>resident);
assert.match(hud,/_resident\?\.RecordConversation\(\)/);
assert.match(hud,/_resident\?\.Bind\(_loop.SaveData\)/);
});
test("scene creation and upgrade are idempotent and do not overwrite authored residents",()=>{
const scene=read("Editor/FirstNeighborhoodResidentSceneBuilder.cs");
assert.match(scene,/File.Exists\(ScenePath\)/);
assert.match(scene,/GameObject.Find\("First Neighborhood Resident"\)/);
assert.match(scene,/AddComponent<FirstNeighborhoodResidentAgent>/);
assert.match(read("Editor/FirstNeighborhoodPrototypeSceneBuilder.cs"),/FirstNeighborhoodResidentSceneBuilder.AddToScene/);
});
test("no fictional resident milestone clears full Nigeria release gate",()=>{
assert.ok(contract.qaLimitations.includes("no Nigeria expansion approval"));
const src=read("Gameplay/FirstNeighborhood/FirstNeighborhoodResidentDirector.cs");
assert.doesNotMatch(src,/gateSatisfied\s*=\s*true|releaseApproved\s*=\s*true/);
});
