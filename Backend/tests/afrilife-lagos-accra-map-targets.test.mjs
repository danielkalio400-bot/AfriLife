import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const root=new URL("../../GameClient/StarterAssets/Assets/_AfriLife/",import.meta.url);
const read=p=>readFileSync(new URL(p,root),"utf8");
const identity=read("World/Production/AfriLifeProductionCityIdentity.cs");
const installer=read("Editor/AfriLifeWorldNavigationInstaller.cs");
const hud=read("World/Production/AfriLifeCityDiscoveryHud.cs");
test("approved Lagos and Accra target areas are installed into city scenes",()=>{
 assert.match(installer,/expectedCityId=="lagos"\?2200:1408/);
 assert.match(installer,/Math\.Sqrt\(plannedArea\)/);
 assert.match(installer,/SetMapTarget\(plannedArea,side,side\)/);
 assert.match(identity,/public int TargetAreaKm2/);
 assert.match(identity,/public float TargetWidthKm/);
 assert.match(identity,/public float TargetHeightKm/);
 assert.match(installer,/EditorSceneManager\.SaveScene\(scene\)/);
});
test("HUD explicitly labels numbers as future targets not built maps",()=>{
 assert.match(hud,/km2 TARGET/);
 assert.match(hud,/Prototype terrain is smaller/);
 assert.match(hud,/TargetWidthKm/);
 assert.match(hud,/TargetHeightKm/);
 assert.doesNotMatch(installer,/DestroyImmediate|DeleteAsset/);
});
