import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {JOURNAL_PAGES,readNeighborhoodJournal as journal}
 from "../src/services/first-neighborhood-journal-reference.mjs";
const original=()=>({
 daysCompleted:1,nextStep:8,waitingSessionsDay:1,waitingSessionsToday:2,
 discoveredSiteIds:["home","market","park"],
 conversationResidentIds:["prototype-resident-ada","prototype-resident-kwame"],
 conversationCounts:[3,1],
 errandReceipts:[{errandId:"clinic-checkin",completedDay:0},
   {errandId:"park-cleanup",completedDay:1}],
 wallet:9000
});
test("all four pages derive their entries from existing save without mutations",()=>{
 const input=original(),before=structuredClone(input);
 assert.deepEqual(JOURNAL_PAGES,["Today","Places","People","Errands"]);
 const today=journal(input,"Today");
 assert.ok(today.lines.includes("DAY 2"));
 assert.ok(today.lines.includes("Hourly waits: 2/4"));
 const places=journal(input,"Places");
 assert.ok(places.lines.includes("Visited: market"));
 assert.ok(places.lines.includes("Not visited: bank"));
 const people=journal(input,"People");
 assert.ok(people.lines.includes("Ada: 3 conversations"));
 assert.ok(people.lines.includes("Bola: 0 conversations"));
 const errands=journal(input,"Errands");
 assert.ok(errands.lines.includes("Completed: park-cleanup"));
 assert.ok(errands.lines.includes("Available: clinic-checkin"));
 assert.equal(errands.grantsMoney,false);
 assert.equal(errands.changesSave,false);
 assert.deepEqual(input,before);
});
test("completed day transitions retain discovery and conversation history",()=>{
 const state=JSON.parse(JSON.stringify(original()));
 state.daysCompleted=2;state.waitingSessionsDay=2;state.waitingSessionsToday=0;
 const places=journal(state,"Places");
 const people=journal(state,"People");
 const errands=journal(state,"Errands");
 assert.equal(places.lines.find(x=>x.includes("Visited: market")),"Visited: market");
 assert.ok(people.lines.includes("Kwame: 1 conversations"));
 assert.ok(errands.lines.includes("Available: park-cleanup"));
});
test("missing and inconsistent state returns explicit error rather than inventing history",()=>{
 assert.equal(journal(null).error,"invalid_journal_state");
 assert.equal(journal(original(),"Fake").error,"invalid_journal_state");
 assert.equal(journal({...original(),discoveredSiteIds:["home","home"]},"Places").error,
  "invalid_landmark_history");
 assert.equal(journal({...original(),conversationCounts:[]},"People").error,
  "invalid_resident_history");
 assert.equal(journal({...original(),nextStep:900},"Today").error,
  "invalid_journal_progress");
});
test("Unity journal uses the canonical world save and is accessible from safe-area HUD",()=>{
 const root=new URL("../../GameClient/StarterAssets/Assets/_AfriLife/",import.meta.url);
 const read=path=>readFileSync(new URL(path,root),"utf8");
 const service=read("Gameplay/FirstNeighborhood/FirstNeighborhoodJournal.cs");
 const hud=read("Gameplay/FirstNeighborhood/FirstNeighborhoodPrototypeHud.cs");
 for(const symbol of ["state.DiscoveredSiteIds","state.ConversationResidentIds",
   "state.ConversationCounts","state.ErrandReceipts","state.DaysCompleted",
   "FirstNeighborhoodWorldClock.Display"])
   assert.ok(service.includes(symbol),symbol);
 assert.match(hud,/Open neighborhood journal/);
 assert.match(hud,/FirstNeighborhoodJournal.Pages/);
 assert.match(hud,/FirstNeighborhoodJournal.Render\(/);
 assert.match(hud,/Screen.safeArea/);
 assert.doesNotMatch(service,/LocalWorldSaveStore.Save/);
});
