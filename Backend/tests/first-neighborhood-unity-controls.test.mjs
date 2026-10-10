import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const root=new URL("../../GameClient/StarterAssets/Assets/_AfriLife/",import.meta.url);
const source=p=>readFileSync(new URL(p,root),"utf8");
test("scene generation cannot discard existing editor scenes or cross-modify roots",()=>{
 const builder=source("Editor/FirstNeighborhoodPrototypeSceneBuilder.cs");
 const layer=source("Editor/FirstNeighborhoodWalkLayerBuilder.cs");
 assert.match(builder,/NewSceneMode\.Additive/);
 assert.match(builder,/Save all open Unity scenes/);
 assert.match(builder,/SceneManager\.SetActiveScene\(previous\)/);
 assert.match(builder,/EditorSceneManager\.CloseScene\(scene,true\)/);
 assert.match(layer,/scene\.GetRootGameObjects\(\)/);
 assert.match(layer,/FindInScene\(scene,name\)/);
 assert.doesNotMatch(layer,/GameObject\.Find\(/);
 for(const name of ["FirstNeighborhoodWalkLayerBuilder.cs","FirstNeighborhoodSceneValidator.cs","FirstNeighborhoodResidentSceneBuilder.cs"])
  assert.match(source("Editor/"+name),/SaveCurrentModifiedScenesIfUserWantsTo/);
});
test("Unity walking supports controllers and resets touch movement after focus loss",()=>{
 const control=source("Gameplay/FirstNeighborhood/FirstNeighborhoodWalkController.cs");
 assert.match(control,/Gamepad\.current/);
 assert.match(control,/pad\.leftStick\.ReadValue\(\)/);
 assert.match(control,/stick\.sqrMagnitude >= 0\.0225f/);
 assert.match(control,/OnApplicationFocus\(bool focused\)/);
 assert.match(control,/OnDisable\(\)/);
 assert.match(control,/_controller\.SimpleMove/);
 assert.match(control,/state\.HasSavedPosition=true/);
});
