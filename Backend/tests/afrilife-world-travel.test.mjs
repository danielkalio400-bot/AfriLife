import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const root=new URL("../../GameClient/StarterAssets/Assets/_AfriLife/",import.meta.url);
const read=p=>readFileSync(new URL(p,root),"utf8");
const catalog=read("World/Travel/AfriLifeTravelCatalog.cs");
const divisions=read("World/Travel/AfriLifeDivision.cs");
const checkpoint=read("World/Travel/AfriLifeTravelCheckpoint.cs");
const navigator=read("World/Travel/AfriLifeWorldNavigator.cs");
const installer=read("Editor/AfriLifeWorldNavigationInstaller.cs");
const sceneBuilder=read("Editor/AfriLifeProductionCityBuilder.cs");

test("world directory contains exactly 36 Nigerian states plus FCT and 16 Ghana regions",()=>{
 const rows=[...catalog.matchAll(/new AfriLifeDivision\("([^"]+)","(NG|GH)","([^"]+)","(State|FCT|Region)"\)/g)];
 assert.equal(rows.length,53);
 assert.equal(rows.filter(x=>x[2]==="NG"&&x[4]==="State").length,36);
 assert.equal(rows.filter(x=>x[2]==="NG"&&x[4]==="FCT").length,1);
 assert.equal(rows.filter(x=>x[2]==="GH"&&x[4]==="Region").length,16);
 assert.equal(new Set(rows.map(x=>x[1])).size,53);
 assert.match(catalog,/new AfriLifeDivision\("ng-rivers","NG","Rivers","State"\)/);
 assert.match(catalog,/new AfriLifeDivision\("gh-greater-accra","GH","Greater Accra","Region"\)/);
 assert.match(divisions,/public bool SceneAuthored/);
});

test("only two actual scenes, all other planned cities cannot be loaded",()=>{
 assert.match(catalog,/ProductionLagos\.unity/);
 assert.match(catalog,/ProductionAccra\.unity/);
 const entries=[...catalog.matchAll(/new AfriLifeTravelCity\("([^"]+)","([^"]+)","([^"]+)",([^)]+)\)/g)];
 assert.equal(entries.length,12);
 assert.equal(entries.filter(x=>x[4]==="LagosScene"||x[4]==="AccraScene").length,2);
 assert.equal(entries.filter(x=>x[4]==="null").length,10);
 assert.match(catalog,/new AfriLifeTravelCity\("port-harcourt","Port Harcourt","ng-rivers",null\)/);
 assert.match(navigator,/Application\.CanStreamedLevelBeLoaded/);
 assert.match(navigator,/!destination\.SceneAuthored/);
});

test("save-safe cross-city travel uses independent two-slot verified checkpoint",()=>{
 assert.match(checkpoint,/SHA256\.Create/);
 assert.match(checkpoint,/afrilife-world-travel\.json/);
 assert.match(checkpoint,/string SlotA|SlotA=>/);
 assert.match(checkpoint,/string SlotB|SlotB=>/);
 assert.match(checkpoint,/File\.Move\(temporary,target\)/);
 assert.match(checkpoint,/TryPosition/);
 assert.match(checkpoint,/Capture/);
 assert.match(checkpoint,/both travel checkpoints unreadable|Both travel checkpoints unreadable/);
 assert.doesNotMatch(checkpoint,/LocalWorldSaveStore\.Save|WorldSaveData\.Player/);
 assert.match(navigator,/SceneManager\.LoadSceneAsync/);
 assert.match(navigator,/LoadSceneMode\.Single/);
 assert.match(navigator,/CharacterController/);
 assert.doesNotMatch(navigator,/LocalWorldSaveStore\.Save|Player\.CountryId\s*=/);
});

test("travel controls attach non-destructively to existing authored city scenes",()=>{
 assert.match(installer,/AfriLifeTravelCatalog\.LagosScene/);
 assert.match(installer,/AfriLifeTravelCatalog\.AccraScene/);
 assert.match(installer,/GetComponent<AfriLifeWorldNavigator>\(\)==null/);
 assert.match(installer,/expectedCityId=="accra"/);
 assert.match(installer,/hud\.enabled=false/);
 assert.match(installer,/EditorSceneManager\.MarkSceneDirty/);
 assert.match(installer,/AFRILIFE_TRAVEL_BUILD_RESULT=SUCCESS/);
 assert.match(sceneBuilder,/AfriLifeWorldNavigationInstaller\.Install\(\)/);
 assert.doesNotMatch(installer,/DestroyImmediate|DeleteAsset|CreatePrimitive/);
});

test("navigator uses non-GUILayout controls and never promises simulated border travel",()=>{
 assert.match(navigator,/GUI\.BeginScrollView/);
 assert.match(navigator,/GUI\.EndScrollView/);
 assert.doesNotMatch(navigator,/GUILayout\./);
 assert.match(navigator,/Road, flight and border journeys are not yet simulated/);
 assert.match(navigator,/Current: /);
});

test("Windows installer requires verified world travel scene installation",()=>{
 const ps=readFileSync(new URL("../../Build-AfriLife-Cities.ps1",import.meta.url),"utf8");
 assert.match(ps,/AFRILIFE_TRAVEL_BUILD_RESULT=SUCCESS/);
 assert.match(ps,/AFRILIFE TRAVEL NAVIGATION INSTALLED IN UNITY/);
 assert.match(ps,/not \$travelConfirmed/);
});
