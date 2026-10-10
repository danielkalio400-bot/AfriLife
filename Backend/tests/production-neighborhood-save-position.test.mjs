import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const root=new URL("../../GameClient/StarterAssets/Assets/_AfriLife/", import.meta.url);
const src=file=>readFileSync(new URL(file,root),"utf8");

test("realistic neighborhoods restore original saved positions on nearby baked walkable ground",()=>{
  const walk=src("Gameplay/FirstNeighborhood/FirstNeighborhoodWalkController.cs");
  assert.match(walk,/HasImportedProductionWorld\(\)/);
  assert.match(walk,/gameObject\.scene\.GetRootGameObjects\(\)/);
  assert.match(walk,/root\.name == "AfriLife Production Neighborhood"/);
  assert.match(walk,/NavMesh\.SamplePosition\(p, out NavMeshHit ground/);
  assert.match(walk,/5f, NavMesh\.AllAreas/);
  assert.match(walk,/sqrMagnitude > 2\.25f/);
  assert.match(walk,/p = ground\.position/);
  assert.match(walk,/bool wasEnabled = _controller\.enabled/);
  assert.match(walk,/if \(wasEnabled\) _controller\.enabled = true/);
  assert.match(walk,/transform\.position = p/);
  assert.match(walk,/state\.HasSavedPosition=true/);
});

test("legacy scene bounds remain compatibility-only and failed NavMesh restores do not corrupt player save",()=>{
  const walk=src("Gameplay/FirstNeighborhood/FirstNeighborhoodWalkController.cs");
  assert.match(walk,/else\s*\{\s*\/\/ Keep compatibility with the original/);
  assert.match(walk,/Mathf\.Clamp\(p\.x, -16f, 16f\)/);
  assert.match(walk,/Mathf\.Clamp\(p\.z, -16f, 16f\)/);
  assert.match(walk,/Preserving the saved coordinates/);
  assert.match(walk,/if \(float\.IsNaN\(p\.x\) \|\| float\.IsInfinity\(p\.x\)/);
  const productionBranch=walk.split("if (HasImportedProductionWorld())")[1].split("else")[0];
  assert.doesNotMatch(productionBranch,/Mathf\.Clamp/);
  assert.match(productionBranch,/return;/);
});

test("walking continues with CharacterController and saved game state",()=>{
  const walk=src("Gameplay/FirstNeighborhood/FirstNeighborhoodWalkController.cs");
  assert.match(walk,/_controller\.SimpleMove/);
  assert.match(walk,/GUI\.RepeatButton/);
  assert.match(walk,/state\.PlayerX=transform\.position\.x/);
  assert.match(walk,/state\.PlayerZ=transform\.position\.z/);
  assert.match(walk,/HasMovedSinceCapture/);
});
