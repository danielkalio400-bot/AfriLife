import test from "node:test";
import assert from "node:assert/strict";
import { FolkloreStoriesService } from "../src/services/folklore-stories.mjs";
import { folkloreRuntime } from "../src/folklore-contracts.mjs";
import { makeServer } from "../src/server.mjs";

const example = (countryId="Nigeria", regionId="Lagos") => ({
  characterId:"character-1",countryId,regionId,propertyId:"house-1",
  theme:"lamplit-hall",requestId:"start-1"
});
test("fictional folklore is opt-in and default state hides journals",()=>{
  const world = new FolkloreStoriesService();
  assert.equal(world.preference("character-1").mode,"off");
  assert.equal(world.startStory(example()).error,"folklore_opt_in_required");
  assert.deepEqual(world.journal("character-1"),[]);
  assert.equal(folkloreRuntime.defaultMode,"off");
  assert.match(folkloreRuntime.safety.join(" "), /no real deities/);
});
test("Nigeria and Ghana feature parity; stories are character-owned",()=>{
  const world = new FolkloreStoriesService();
  world.setPreference({characterId:"character-1",mode:"ambiguous"});
  world.setPreference({characterId:"character-2",mode:"supernatural"});
  const ng = world.startStory(example());
  const gh = world.startStory({...example("Ghana","Accra"),characterId:"character-2"});
  assert.equal(ng.ok,true); assert.equal(gh.ok,true);
  assert.equal(world.journal("character-1",{countryId:"Ghana"}).length,0);
  assert.equal(world.journal("character-2",{countryId:"Ghana"}).length,1);
  assert.equal(world.getStory("character-2",ng.story.storyId),null);
  assert.equal(world.choose({characterId:"character-2",storyId:ng.story.storyId,choice:"observe",decisionId:"d"}).error,"story_not_found");
});
test("requests and choices cannot duplicate or replay different payloads",()=>{
  const world = new FolkloreStoriesService();
  world.setPreference({characterId:"character-1",mode:"ambiguous"});
  const first=world.startStory(example());
  assert.equal(first.ok,true);
  assert.equal(world.startStory(example()).replay,true);
  assert.equal(world.startStory({...example(),theme:"old-library"}).error,"request_id_conflict");
  assert.equal(world.startStory({...example(),requestId:"second"}).error,"property_story_already_active");
  const entry={characterId:"character-1",storyId:first.story.storyId,choice:"observe",decisionId:"a"};
  assert.equal(world.choose(entry).story.stage,"investigating");
  assert.equal(world.choose(entry).replay,true);
  assert.equal(world.choose({...entry,choice:"reassure"}).error,"decision_id_conflict");
  const final=world.choose({...entry,choice:"reassure",decisionId:"b"}).story;
  assert.equal(final.status,"resolved");
  assert.equal(final.outcomeTag,"unexplained-but-peaceful");
  assert.equal(world.choose({...entry,decisionId:"c"}).error,"story_not_active");
  assert.equal(world.startStory({...example(),requestId:"third"}).ok,true);
});
test("opting out blocks progression, journals and future starts; non-graphic solutions",()=>{
  const world = new FolkloreStoriesService();
  world.setPreference({characterId:"character-1",mode:"supernatural"});
  const story=world.startStory(example()).story;
  const finished=world.choose({characterId:"character-1",storyId:story.storyId,choice:"leave",decisionId:"choice-1"}).story;
  assert.equal(finished.status,"resolved");
  assert.equal(finished.outcomeTag,"resident-chose-to-leave");
  assert.equal(finished.propertyReputation01,0.5);
  world.startStory({...example(),requestId:"second"});
  assert.equal(world.setPreference({characterId:"character-1",mode:"off"}).ok,true);
  assert.deepEqual(world.journal("character-1"),[]);
  assert.equal(world.getStory("character-1",story.storyId),null);
  assert.equal(world.startStory({...example(),requestId:"third"}).error,"folklore_opt_in_required");
});
test("rejects non-fictional themes, invalid choices and implicit opt-ins",()=>{
 const world=new FolkloreStoriesService();
 assert.equal(world.setPreference({characterId:"c",mode:"enabled"}).error,"invalid_folklore_preference");
 world.setPreference({characterId:"c",mode:"ambiguous"});
 assert.equal(world.startStory({...example(),characterId:"c",theme:"real-tradition"}).error,"invalid_folklore_story");
 assert.equal(world.startStory({...example(),characterId:"c",countryId:"other"}).error,"invalid_folklore_story");
 assert.equal(world.choose({characterId:"c",storyId:"none",choice:"ritual",decisionId:"x"}).error,"invalid_folklore_choice");
});
test("local API flows through settings, start, resolve and journal",async t=>{
 const server=makeServer();
 await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
 t.after(()=>server.close());
 const base="http://127.0.0.1:"+server.address().port;
 const post=async (path,body)=>{
   const response=await fetch(base+path,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)});
   return {status:response.status,body:await response.json()};
 };
 let pref=await post("/v1/dev/folklore/preferences",{characterId:"c1",mode:"supernatural"});
 assert.equal(pref.status,200);
 let start=await post("/v1/dev/folklore/stories",{...example("Ghana","Kumasi"),characterId:"c1"});
 assert.equal(start.status,200);
 assert.equal(start.body.story.mode,"supernatural");
 let done=await post("/v1/dev/folklore/decisions",{
   characterId:"c1",storyId:start.body.story.storyId,choice:"leave",decisionId:"dec-1"
 });
 assert.equal(done.body.story.status,"resolved");
 let journal=await fetch(base+"/v1/dev/folklore/journal?characterId=c1&countryId=Ghana");
 assert.equal((await journal.json()).stories.length,1);
});
