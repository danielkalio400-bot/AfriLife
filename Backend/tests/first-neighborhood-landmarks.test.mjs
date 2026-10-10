import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {FIRST_NEIGHBORHOOD_SITES,discoverFirstNeighborhoodLandmark as discover}
 from "../src/services/first-neighborhood-landmarks-reference.mjs";
test("all seven scene landmarks are distinct and discoverable within actual scene range",()=>{
 const state={daysCompleted:0,discoveredSiteIds:[]};
 const visited=new Set();
 let current=state;
 for(const site of FIRST_NEIGHBORHOOD_SITES){
  assert.equal(visited.has(site.id),false);
  visited.add(site.id);
  const result=discover(current,{x:site.x,z:site.z,siteId:site.id});
  assert.equal(result.ok,true);
  assert.equal(result.newDiscovery,true);
  current=result.state;
 }
 assert.equal(current.discoveredSiteIds.length,7);
 assert.equal(current.daysCompleted,0);
});
test("must physically reach a real site; repeated discovery does not duplicate",()=>{
 const state={discoveredSiteIds:[]};
 assert.equal(discover(state,{x:0,z:0,siteId:"home"}).error,
  "landmark_not_reached");
 assert.equal(discover(state,{x:0,z:0,siteId:"invented"}).error,
  "landmark_not_reached");
 const first=discover(state,{x:0,z:8.9,siteId:"clinic"});
 assert.equal(first.newDiscovery,true);
 const second=discover(first.state,{x:0,z:8.9,siteId:"clinic"});
 assert.equal(second.newDiscovery,false);
 assert.deepEqual(second.state.discoveredSiteIds,["clinic"]);
 assert.deepEqual(state.discoveredSiteIds,[]);
});
test("verified save/reload retains discoveries across game days without money changes",()=>{
 const before={discoveredSiteIds:[],daysCompleted:0,wallet:1200};
 const first=discover(before,{x:9,z:-4.8,siteId:"market"}).state;
 const loaded=JSON.parse(JSON.stringify(first));
 loaded.daysCompleted=1;
 const second=discover(loaded,{x:2,z:2,siteId:"park"}).state;
 assert.deepEqual(second.discoveredSiteIds,["market","park"]);
 assert.equal(second.wallet,1200);
 assert.equal(second.daysCompleted,1);
});
test("malformed or duplicated discovery ledgers fail closed",()=>{
 const bad={discoveredSiteIds:["home","home"]};
 assert.equal(discover(bad,{x:9,z:-4.8,siteId:"market"}).error,
  "corrupt_landmark_ledger");
 const invalid={discoveredSiteIds:["fictional-hidden-site"]};
 assert.equal(discover(invalid,{x:9,z:-4.8,siteId:"market"}).error,
  "corrupt_landmark_ledger");
});
test("Unity discovery service is physical, stored and shown in the neighborhood HUD",()=>{
 const root=new URL("../../GameClient/StarterAssets/Assets/_AfriLife/",import.meta.url);
 const read=p=>readFileSync(new URL(p,root),"utf8");
 const code=read("Gameplay/FirstNeighborhood/FirstNeighborhoodLandmarkService.cs");
 assert.match(code,/point.Contains\(player.transform.position\)/);
 assert.match(code,/DiscoveredSiteIds=discovered.ToArray\(\)/);
 assert.match(code,/public static readonly string\[\] SiteIds/);
 const state=read("Gameplay/FirstNeighborhood/FirstNeighborhoodPrototypeState.cs");
 assert.match(state,/DiscoveredSiteIds/);
 const integrity=read("Core/Save/FirstNeighborhoodSaveIntegrity.cs");
 assert.match(integrity,/duplicate-or-unknown-landmark/);
 const hud=read("Gameplay/FirstNeighborhood/FirstNeighborhoodPrototypeHud.cs");
 assert.match(hud,/discovery.DiscoverNear\(_actor,_points/);
 assert.match(hud,/SavePlayerPosition\(\)/);
 assert.match(hud,/Discovered neighborhood landmarks/);
});
