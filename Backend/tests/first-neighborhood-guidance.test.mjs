import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {neighborhoodRouteCue as guide,validateNeighborhoodMarkers as inspect}
 from "../src/services/first-neighborhood-route-reference.mjs";
const u=new URL("../../GameClient/StarterAssets/Assets/_AfriLife/",import.meta.url);
const src=p=>readFileSync(new URL(p,u),"utf8");
test("guide computes only straight-line directions and arrival on authored sites",()=>{
 const home=guide("wake",{x:-11,z:-6.5});
 assert.equal(home.ok,true);
 assert.equal(home.direction,"HERE");
 assert.equal(home.withinReach,true);
 const work=guide("work",{x:-11,z:-6.5});
 assert.equal(work.siteId,"workplace");
 assert.equal(work.direction,"E");
 assert.ok(work.straightLineMeters>20);
 const bank=guide("pay-bills",{x:-7,z:-6.5});
 assert.equal(bank.direction,"N");
 assert.equal(guide("pay-bills",{x:Infinity,z:0}).ok,false);
});
test("scene validator catches missing or duplicate markers and resident identities",()=>{
 const markers=["home","market","workplace","bank","park","neighbor","clinic"];
 const residents=["prototype-resident-ada","prototype-resident-bola",
   "prototype-resident-kwame"];
 assert.equal(inspect(markers,residents).ok,true);
 assert.deepEqual(inspect([...markers,"home"],residents).issues,["marker_home"]);
 assert.deepEqual(inspect(markers,residents.slice(1)).issues,
   ["resident_prototype-resident-ada"]);
});
test("Unity upgrades existing player scene instead of skipping other marker repairs",()=>{
 const builder=src("Editor/FirstNeighborhoodWalkLayerBuilder.cs");
 assert.match(builder,/GameObject root=FindInScene\(scene,"AfriLife Walkable Player"\)/);
 assert.doesNotMatch(builder,/if \(FindInScene\(scene,"AfriLife Walkable Player"\) != null\)\s*return/);
 assert.match(builder,/GameObject existing=FindInScene\(scene,"Interact - "\+name\)/);
 assert.match(builder,/AddClinicMarker\(scene\)/);
 const validator=src("Editor/FirstNeighborhoodSceneValidator.cs");
 assert.match(validator,/Validate First Neighborhood Prototype Scene/);
 assert.match(validator,/Missing interaction marker/);
 assert.match(validator,/Expected one resident/);
});
test("demo refuses foreign worlds before character economy changes",()=>{
 const loop=src("Gameplay/FirstNeighborhood/FirstNeighborhoodPrototypeLoop.cs");
 const validation=loop.indexOf('"_save.Player.CountryId"');
 assert.match(loop,/\_save.Player.CountryId!="Nigeria"/);
 assert.match(loop,/\_save.Player.CityId!="Lagos"/);
 assert.ok(loop.indexOf('throw new InvalidOperationException(') <
   loop.indexOf('new FirstNeighborhoodResidentService(_save)'));
 const hud=src("Gameplay/FirstNeighborhood/FirstNeighborhoodPrototypeHud.cs");
 assert.match(hud,/FirstNeighborhoodRouteGuide.TryFind/);
});
