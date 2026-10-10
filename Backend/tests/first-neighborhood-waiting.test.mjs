import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {advanceNeighborhoodWaiting as wait,resetNeighborhoodWaitingForNewDay,
 MAX_HOURLY_WAITS} from "../src/services/first-neighborhood-waiting-reference.mjs";
import {isNeighborhoodServiceOpen}
 from "../src/services/first-neighborhood-world-clock-reference.mjs";
const fresh=()=>({daysCompleted:0,elapsedWorldSeconds:0,nextStep:0,
 waitingSessionsDay:0,waitingSessionsToday:0});
test("home/park waiting advances clock so clinic and market open without awarding cash",()=>{
 const state=fresh();
 assert.equal(isNeighborhoodServiceOpen("clinic-checkin",state.elapsedWorldSeconds),false);
 let outcome=wait(state,{siteId:"home",avatarX:-11.7,avatarZ:-5.6});
 assert.equal(outcome.ok,true);
 assert.equal(outcome.state.elapsedWorldSeconds,3600);
 assert.equal(isNeighborhoodServiceOpen("market-supplies",3600),true);
 outcome=wait(outcome.state,{siteId:"park",avatarX:2,avatarZ:2});
 assert.equal(outcome.ok,true);
 assert.equal(isNeighborhoodServiceOpen("clinic-checkin",outcome.state.elapsedWorldSeconds),true);
 assert.equal(outcome.state.waitingSessionsToday,2);
});
test("physical proximity, wait quota and sleep step prevent time skipping",()=>{
 let s=fresh();
 assert.equal(wait(s,{siteId:"home",avatarX:0,avatarZ:0}).error,
  "rest_spot_out_of_range");
 assert.equal(wait(s,{siteId:"park",avatarX:2,avatarZ:2,
  nearbyMarker:false}).error,"rest_spot_out_of_range");
 assert.equal(wait({...s,nextStep:15},{
  siteId:"home",avatarX:-11.7,avatarZ:-5.6}).error,"invalid_wait_state");
 for(let i=0;i<MAX_HOURLY_WAITS;i++){
  const result=wait(s,{siteId:"home",avatarX:-11.7,avatarZ:-5.6});
  assert.equal(result.ok,true);
  s=result.state;
 }
 const before=structuredClone(s);
 assert.equal(wait(s,{siteId:"home",avatarX:-11.7,avatarZ:-5.6}).error,
  "daily_wait_limit");
 assert.deepEqual(s,before);
 assert.equal(wait({...fresh(),elapsedWorldSeconds:14*3600},{
  siteId:"park",avatarX:2,avatarZ:2}).error,"outside_wait_hours");
});
test("wait quota survives serialized reload and resets only on the next game day",()=>{
 let s=fresh();
 s=wait(s,{siteId:"home",avatarX:-11.7,avatarZ:-5.6}).state;
 const saved=JSON.parse(JSON.stringify(s));
 assert.equal(saved.waitingSessionsToday,1);
 assert.equal(wait(saved,{siteId:"home",avatarX:-11.7,avatarZ:-5.6})
  .state.waitingSessionsToday,2);
 const next=resetNeighborhoodWaitingForNewDay({...saved,daysCompleted:1,
  elapsedWorldSeconds:86400});
 assert.equal(next.waitingSessionsDay,1);
 assert.equal(next.waitingSessionsToday,0);
 assert.equal(wait(next,{siteId:"home",avatarX:-11.7,avatarZ:-5.6}).ok,true);
});
test("Unity requires a scene marker and rest prop, persists quota and refreshes NPCs",()=>{
 const root=new URL("../../GameClient/StarterAssets/Assets/_AfriLife/",import.meta.url);
 const read=p=>readFileSync(new URL(p,root),"utf8");
 const service=read("Gameplay/FirstNeighborhood/FirstNeighborhoodWaitingService.cs");
 const hud=read("Gameplay/FirstNeighborhood/FirstNeighborhoodPrototypeHud.cs");
 const state=read("Gameplay/FirstNeighborhood/FirstNeighborhoodPrototypeState.cs");
 const loop=read("Gameplay/FirstNeighborhood/FirstNeighborhoodPrototypeLoop.cs");
 const check=read("Core/Save/FirstNeighborhoodSaveIntegrity.cs");
 for(const s of ["actor==null","prop.Contains(actor.transform.position)",
   "CanPerformSite","state.ElapsedWorldSeconds+=HourSeconds",
   "_loop.Residents.AdvanceSchedule"])
   assert.ok(service.includes(s),s);
 assert.match(hud,/Wait 1 hour at home or park/);
 assert.match(hud,/SavePlayerPosition\(\)/);
 assert.match(state,/public int WaitingSessionsToday/);
 assert.match(loop,/State.WaitingSessionsToday=0/);
 assert.match(check,/state.WaitingSessionsToday > FirstNeighborhoodWaitingService.MaxHourlyWaitsPerDay/);
});
