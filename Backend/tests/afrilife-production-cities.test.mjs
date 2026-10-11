import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const root=new URL("../../GameClient/StarterAssets/Assets/_AfriLife/",import.meta.url);
const read=p=>readFileSync(new URL(p,root),"utf8");
const scene=read("Editor/AfriLifeProductionCityBuilder.cs");
const identity=read("World/Production/AfriLifeProductionCityIdentity.cs");
test("AfriLife builds two independent authored Nigeria Ghana city scene files",()=>{
 assert.match(scene,/ProductionLagos\.unity/);
 assert.match(scene,/ProductionAccra\.unity/);
 assert.match(scene,/SaveScene\(source, destination, true\)/);
 assert.match(scene,/if \(File\.Exists\(destination\)\)/);
 assert.match(scene,/FirstNeighborhoodPrototypeSceneBuilder\.BuildUnattended/);
 assert.match(scene,/FirstNeighborhoodWalkController/);
 assert.match(scene,/FirstNeighborhoodResidentAgent/);
 assert.match(scene,/FirstNeighborhoodInteractionPoint/);
 assert.match(scene,/AFRILIFE_CITY_BUILD_RESULT=SUCCESS/);
 assert.doesNotMatch(scene,/DeleteAsset\(|SaveScene\(source, OriginalScene/);
});
test("original city structures, surfaces, physical sites and source provenance are distinct",()=>{
 for(const key of ["BuildRoads","BuildServices","BuildHomes","BuildStreetDetail",
     "Pedestrian Pavement","Market Sales Counter","Power Pole","Neighbourhood Market"])
     assert.match(scene,new RegExp(key));
 assert.match(scene,/Universal Render Pipeline\/Lit/);
 assert.match(scene,/TextureImporterCompression\.Compressed/);
 assert.match(scene,/Collider c = original\.GetComponent<Collider>/);
 assert.match(scene,/OriginalScene/);
 assert.match(identity,/CountryIso2/);
 assert.match(identity,/LocalizedEconomy/);
 assert.match(scene,/CreateCity\("accra", "GH", "Accra, Ghana", AccraScene, false\)/);
});
