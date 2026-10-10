import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {firstNeighborhoodInformalChat as chat}
 from "../src/services/first-neighborhood-resident-dialogue-reference.mjs";
const original=()=>({residentId:"prototype-resident-ada",
 actorNear:true,awake:true,elapsedWorldSeconds:0,
 conversationResidentIds:[],conversationCounts:[]});
test("three familiar residents offer morning, daytime and evening context",()=>{
 const names=["prototype-resident-ada","prototype-resident-bola",
 "prototype-resident-kwame"];
 for(const residentId of names){
  const morning=chat({...original(),residentId,elapsedWorldSeconds:0});
  const day=chat({...original(),residentId,elapsedWorldSeconds:5*3600});
  const evening=chat({...original(),residentId,elapsedWorldSeconds:12*3600});
  assert.equal(morning.ok,true);
  assert.equal(day.ok,true);
  assert.equal(evening.ok,true);
  assert.notEqual(morning.dialogue,day.dialogue);
  assert.notEqual(day.dialogue,evening.dialogue);
 }
});
test("physical distance, sleep, unknown identity and malformed state deny dialogue",()=>{
 assert.equal(chat({...original(),actorNear:false}).error,"out_of_range");
 assert.equal(chat({...original(),awake:false}).error,"resident_unavailable");
 assert.equal(chat({...original(),elapsedWorldSeconds:16*3600}).error,
  "resident_unavailable");
 assert.equal(chat({...original(),residentId:"unknown"}).error,
  "unknown_resident");
 assert.equal(chat({...original(),conversationResidentIds:["a"],
    conversationCounts:[]}).error,"invalid_conversation_history");
});
test("informal conversation is read-only; familiarity reflects actual scripted history",()=>{
 const input=original(),before=structuredClone(input);
 const first=chat(input);
 assert.match(first.dialogue,/Hello, welcome/);
 assert.equal(first.reputationDelta,0);
 assert.equal(first.progression,false);
 assert.equal(first.persisted,false);
 assert.equal(first.affectsDailyStep,false);
 assert.deepEqual(input,before);
 const familiar=chat({...input,conversationResidentIds:["prototype-resident-ada"],
    conversationCounts:[2]});
 assert.match(familiar.dialogue,/Good to see you again/);
 assert.deepEqual(input,before);
});
test("Unity informal dialogue is physically gated and cannot double grant story conversations",()=>{
 const root=new URL("../../GameClient/StarterAssets/Assets/_AfriLife/",import.meta.url);
 const get=p=>readFileSync(new URL(p,root),"utf8");
 const dialogue=get("Gameplay/FirstNeighborhood/FirstNeighborhoodResidentDialogue.cs");
 const service=get("Gameplay/FirstNeighborhood/FirstNeighborhoodResidentService.cs");
 const hud=get("Gameplay/FirstNeighborhood/FirstNeighborhoodPrototypeHud.cs");
 const validator=get("Core/Save/FirstNeighborhoodSaveIntegrity.cs");
 assert.match(dialogue,/agent.InConversationRange\(player.transform.position\)/);
 assert.match(dialogue,/npc.Sleeping/);
 assert.match(dialogue,/FirstNeighborhoodWorldClock.HourOfDay/);
 assert.doesNotMatch(dialogue,/TryConversation|Wallet|LocalWorldSaveStore.Save|Reputation\s*=/);
 assert.match(hud,/Chat with /);
 assert.match(hud,/FirstNeighborhoodResidentDialogue.TryChat/);
 assert.match(service,/state.ConversationCount=Math.Min\(100000,state.ConversationCount\+1\)/);
 assert.match(service,/state.LastConversationDay=state.DaysCompleted/);
 assert.match(validator,/state.LastConversationDay>state.DaysCompleted/);
 const idx=service.indexOf("state.ConversationCount=Math.Min");
 assert.ok(idx>service.indexOf("state.ConversationCounts[existing]++"));
});
