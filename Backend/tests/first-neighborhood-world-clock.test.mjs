import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {worldMinuteOfDay,worldHourOfDay,nextNeighborhoodMorning,
 isNeighborhoodServiceOpen} from "../src/services/first-neighborhood-world-clock-reference.mjs";

test("world clock starts at six and day transition advances to next morning",()=>{
 assert.equal(worldMinuteOfDay(0),360);
 assert.equal(worldHourOfDay(0),6);
 // Scripted work, commute and sleep leave the first day at 18:40.
 const last=1200+14400+1200+28800;
 assert.equal(worldHourOfDay(last),18);
 const newDay=nextNeighborhoodMorning(last);
 assert.equal(newDay,86400);
 assert.equal(worldMinuteOfDay(newDay),360);
 assert.equal(nextNeighborhoodMorning(86400),172800);
 assert.equal(nextNeighborhoodMorning(172800),259200);
 assert.equal(nextNeighborhoodMorning(-1),null);
});
test("service opening windows enforce boundaries independent of system clock",()=>{
 // Relative to the 06:00 simulated start.
 assert.equal(isNeighborhoodServiceOpen("clinic-checkin",0),false);
 assert.equal(isNeighborhoodServiceOpen("clinic-checkin",7200),true);
 assert.equal(isNeighborhoodServiceOpen("clinic-checkin",11*3600),false);
 assert.equal(isNeighborhoodServiceOpen("market-supplies",0),false);
 assert.equal(isNeighborhoodServiceOpen("market-supplies",3600),true);
 assert.equal(isNeighborhoodServiceOpen("market-supplies",13*3600),false);
 assert.equal(isNeighborhoodServiceOpen("park-cleanup",0),true);
 assert.equal(isNeighborhoodServiceOpen("neighbor-help",15*3600),false);
 assert.equal(isNeighborhoodServiceOpen("unknown",10000),false);
});
test("Unity runtime integrates common clock into residents, errands and day change",()=>{
 const root=new URL("../../GameClient/StarterAssets/Assets/_AfriLife/",import.meta.url);
 const get=p=>readFileSync(new URL(p,root),"utf8");
 const clock=get("Gameplay/FirstNeighborhood/FirstNeighborhoodWorldClock.cs");
 assert.match(clock,/SecondsUntilNextMorning/);
 assert.match(clock,/IsServiceOpen/);
 assert.match(clock,/checked\(elapsedWorldSeconds\+SecondsUntilNextMorning/);
 const loop=get("Gameplay/FirstNeighborhood/FirstNeighborhoodPrototypeLoop.cs");
 assert.match(loop,/FirstNeighborhoodWorldClock.BeginNextDay\(/);
 assert.match(loop,/AdvanceSchedule\(State.ElapsedWorldSeconds\)/);
 const npc=get("Gameplay/FirstNeighborhood/FirstNeighborhoodResidentService.cs");
 assert.match(npc,/FirstNeighborhoodWorldClock.HourOfDay/);
 const errands=get("Gameplay/FirstNeighborhood/FirstNeighborhoodErrandService.cs");
 assert.ok(errands.indexOf("FirstNeighborhoodWorldClock.IsServiceOpen")<
    errands.indexOf("var player=_loop.SaveData.Player;"));
 const hud=get("Gameplay/FirstNeighborhood/FirstNeighborhoodPrototypeHud.cs");
 assert.match(hud,/Fictional local time/);
 assert.match(hud,/\[closed\]/);
});
