import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {FirstNeighborhoodSaveRecoveryReference as Recovery} from "../src/services/first-neighborhood-save-recovery-reference.mjs";
const state=(id,days=0)=>({header:{schemaVersion:1,worldId:id},player:{days,needs:[1,2],wallet:700}});
test("alternating save slots recover prior verified checkpoint after corrupt latest",()=>{
 const s=new Recovery();
 assert.equal(s.write(state("world-A",0)).target,"A");
 assert.equal(s.write(state("world-A",1)).target,"B");
 assert.equal(s.read().world.player.days,1);
 s.slotB.payload='{"bad":"corrupt"}';
 assert.equal(s.read().world.player.days,0);
 assert.equal(s.read().generation,1);
 assert.equal(s.read().world.header.worldId,"world-A");
});
test("interruption cannot delete earlier verified slot",()=>{
 const s=new Recovery();
 assert.equal(s.write(state("world-A",2)).ok,true);
 const interrupted=s.write(state("world-A",3),{interruptAfterStage:true});
 assert.equal(interrupted.error,"interrupted-before-commit");
 assert.equal(s.read().world.player.days,2);
});
test("reject unrelated world ID and fail closed when all persisted copies corrupt",()=>{
 const s=new Recovery();
 s.write(state("world-A",0));
 assert.equal(s.write(state("world-B",2)).error,"world-identity-mismatch");
 s.slotA.sha256="not-a-valid-checksum";
 assert.equal(s.read().error,"unrecoverable-save");
 assert.equal(s.write(state("world-A",4)).error,"unrecoverable-save");
});
test("legacy saves are read without being deleted during upgrade",()=>{
 const s=new Recovery();
 s.legacy=JSON.stringify(state("legacy-world",5));
 assert.equal(s.read().status,"loaded-legacy-save");
 assert.equal(s.write(state("legacy-world",6)).ok,true);
 assert.equal(s.read().world.player.days,6);
 assert.equal(JSON.parse(s.legacy).player.days,5);
});
test("Unity source uses checksum and alternation; gameplay HUD blocks silent reset",()=>{
 const root=new URL("../../GameClient/StarterAssets/Assets/_AfriLife/",import.meta.url);
 const read=p=>readFileSync(new URL(p,root),"utf8");
 const save=read("Core/Save/LocalWorldSaveStore.cs");
 for(const value of ["SHA256.Create()","SlotAPath","SlotBPath",
   "TryReadSlot(temporary)","File.Move(temporary,target)",
   "File.Exists(FilePath)","InvalidDataException",
   "LastLoadStatus","generation"])
   assert.ok(save.includes(value),value);
 assert.doesNotMatch(save,/File\.Delete\(FilePath\)/);
 const hud=read("Gameplay/FirstNeighborhood/FirstNeighborhoodPrototypeHud.cs");
 assert.match(hud,/TryLoadWorld\(/);
 assert.match(hud,/SavePlayerPosition\(\) && TryLoadWorld/);
 assert.match(hud,/Preserve existing save slots/);
});
