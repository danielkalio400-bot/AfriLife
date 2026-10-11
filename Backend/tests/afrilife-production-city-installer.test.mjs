import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const script=readFileSync(new URL("../../Build-AfriLife-Cities.ps1",import.meta.url),"utf8");
test("AfriLife installer requires existing real Unity URP project and creates two cities",()=>{
 assert.match(script,/ProjectVersion\.txt/);
 assert.match(script,/Universal 3D/);
 assert.match(script,/AfriLife\.Editor\.AfriLifeProductionCityBuilder\.Batch/);
 assert.match(script,/ProductionLagos\.unity/);
 assert.match(script,/ProductionAccra\.unity/);
 assert.match(script,/AFRILIFE_CITY_BUILD_RESULT=SUCCESS/);
});
test("AfriLife source sync preserves local art and rejects modified scripts",()=>{
 assert.match(script,/git clone/);
 assert.match(script,/AfriLifeSourceHashes\.json/);
 assert.match(script,/Get-FileHash/);
 assert.match(script,/Refusing to overwrite locally modified scripts/);
 assert.match(script,/PREVIEW: no project files written/);
 assert.doesNotMatch(script,/backup\/|\.bak|\.zip\b/);
});
