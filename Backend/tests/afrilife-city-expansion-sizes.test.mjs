import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../../GameClient/StarterAssets/Assets/_AfriLife/"+p,import.meta.url),"utf8");
const catalog=read("World/Travel/AfriLifeTravelCatalog.cs");
const plan=read("World/Travel/AfriLifeCityExpansionPlan.cs");
const regionIds=[...catalog.matchAll(/new AfriLifeDivision\("([^"]+)","(NG|GH)"/g)].map(x=>x[1]);
const entries=[...plan.matchAll(/new AfriLifePlannedCity\("([^"]+)","([^"]+)","([^"]+)","(NG|GH)",(\d+)\)/g)];
test("one or more proposed cities in every Nigerian and Ghanaian division",()=>{
 assert.equal(regionIds.length,53);
 for(const id of regionIds)assert.ok(entries.some(x=>x[3]===id),id);
 assert.equal(entries.length,84);
 assert.equal(new Set(entries.map(x=>x[1])).size,entries.length);
});
test("preserve agreed 100%-increased footprints for the first ten cities",()=>{
 const fixed={"Lagos":200,"Accra":128,"Port Harcourt":128,"Abuja":200,"Kumasi":128,"Kano":128,"Ibadan":162,"Sekondi-Takoradi":98,"Enugu":98,"Tamale":98};
 for(const [city,area] of Object.entries(fixed))assert.equal(Number(entries.find(x=>x[2]===city)?.[5]),area,city);
 assert.equal(Object.values(fixed).reduce((a,b)=>a+b,0),1368);
});
test("planned sizes are separate from actual authored Unity scenes",()=>{
 assert.match(plan,/HasAuthoredScene => AfriLifeTravelCatalog.FindCity/);
 assert.doesNotMatch(plan,/LoadSceneAsync|CreatePrimitive|SceneManager\.LoadScene/);
 assert.equal(entries.filter(x=>x[4]==="NG").length,58);
 assert.equal(entries.filter(x=>x[4]==="GH").length,26);
 for(const x of entries)assert.ok(Number(x[5])>0);
});
