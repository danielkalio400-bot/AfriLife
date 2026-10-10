import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {landmarkCompassCue as cue,closestUnvisitedLandmark as closest}
 from "../src/services/first-neighborhood-landmark-guide-reference.mjs";

test("all compass directions and arrival use planar scene marker distance",()=>{
 assert.equal(cue("market",{x:0,z:-4.8}).direction,"E");
 assert.equal(cue("market",{x:12,z:-4.8}).direction,"HERE");
 assert.equal(cue("bank",{x:0,z:7.3}).direction,"W");
 assert.equal(cue("clinic",{x:0,z:0}).direction,"N");
 assert.equal(cue("home",{x:-11,z:0}).direction,"S");
 assert.equal(cue("home",{x:100,z:100}).arrived,false);
 assert.equal(cue("market",{x:0,z:-4.8}).directMeters,9);
 assert.equal(cue("invented",{x:0,z:0}).ok,false);
 assert.equal(cue("home",{x:Infinity,z:0}).ok,false);
});
test("nearest undiscovered ignores already visited sites and honours true marker presence",()=>{
 const state={discoveredSiteIds:["home","park"]};
 const atHome={x:-11,z:-6.5};
 const picked=closest(state,atHome);
 assert.equal(picked.ok,true);
 assert.equal(picked.siteId,"market");
 const sites=[{id:"clinic",x:0,z:8.9}];
 assert.equal(closest(state,atHome,{sites}).siteId,"clinic");
 assert.equal(cue("market",atHome,{sites}).error,"missing_landmark_marker");
});
test("all landmarks visited means no navigation target, without modifying the save",()=>{
 const state={discoveredSiteIds:[
  "home","market","workplace","bank","park","neighbor","clinic"]};
 const before=structuredClone(state);
 assert.equal(closest(state,{x:0,z:0}).error,"no_unvisited_marker");
 assert.deepEqual(state,before);
 assert.equal(closest({discoveredSiteIds:["home","home"]},{x:0,z:0})
  .error,"invalid_visited_landmarks");
});
test("Unity journal exposes optional selectable guidance, not teleportation or wallet mutation",()=>{
 const root=new URL("../../GameClient/StarterAssets/Assets/_AfriLife/",import.meta.url);
 const read=p=>readFileSync(new URL(p,root),"utf8");
 const guide=read("Gameplay/FirstNeighborhood/FirstNeighborhoodLandmarkGuide.cs");
 const hud=read("Gameplay/FirstNeighborhood/FirstNeighborhoodPrototypeHud.cs");
 assert.match(guide,/FirstNeighborhoodInteractionPoint\[\] sceneMarkers/);
 assert.match(guide,/TryNearestUndiscovered/);
 assert.match(guide,/Vector3 offset=closest.transform.position-position/);
 assert.match(hud,/Guide to nearest undiscovered landmark/);
 assert.match(hud,/Guide to: /);
 assert.match(hud,/Clear journal guide/);
 assert.match(hud,/FirstNeighborhoodLandmarkGuide.TryGetCue/);
 assert.doesNotMatch(guide,/transform.position\s*=/);
 assert.doesNotMatch(guide,/Wallet|LocalWorldSaveStore.Save/);
});
