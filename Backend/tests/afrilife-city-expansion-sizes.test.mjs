import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const source=readFileSync(new URL("../../GameClient/StarterAssets/Assets/_AfriLife/World/Travel/AfriLifeCityExpansionPlan.cs",import.meta.url),"utf8");
const entries=[...source.matchAll(/new AfriLifePlannedCity\("([^"]+)","([^"]+)","([^"]+)","(NG|GH)",(\d+)\)/g)];
const agreed={lagos:200,accra:128,"port-harcourt":128,abuja:200,kumasi:128,kano:128,ibadan:162,"sekondi-takoradi":98,enugu:98,tamale:98};
test("only ten explicitly agreed priority cities are in active production",()=>{
 assert.equal(entries.length,10);
 assert.deepEqual(new Set(entries.map(x=>x[1])),new Set(Object.keys(agreed)));
 assert.equal(entries.filter(x=>x[4]==="NG").length,6);
 assert.equal(entries.filter(x=>x[4]==="GH").length,4);
});
test("agreed targets total exactly 1368 square kilometres",()=>{
 for(const row of entries)assert.equal(Number(row[5]),agreed[row[1]]);
 assert.equal(entries.reduce((sum,row)=>sum+Number(row[5]),0),1368);
 assert.equal(new Set(entries.map(x=>x[3])).size,10);
});
