import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const source=readFileSync(new URL("../../GameClient/StarterAssets/Assets/_AfriLife/Player/Interaction/InteractionContext.cs",import.meta.url),"utf8");
test("Unity 6 interaction context does not require IsExternalInit",()=>{
 for(const property of ["ActorId","Clock","Needs","Inventory","Wallet"])
   assert.match(source,new RegExp("\\b"+property+"\\s*\\{\\s*get;\\s*set;\\s*\\}"));
 assert.equal((source.match(/get; set;/g)||[]).length,5);
 assert.doesNotMatch(source,/get;\s*init;/);
});
