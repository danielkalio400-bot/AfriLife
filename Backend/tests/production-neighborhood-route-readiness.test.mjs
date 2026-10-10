import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const root=new URL("../../GameClient/StarterAssets/Assets/_AfriLife/", import.meta.url);
const source=p=>readFileSync(new URL(p,root), "utf8");

test("production neighbor-world validator checks connected baked routes, not just agents",()=>{
  const editor=source("Editor/AfriLifeProductionArtInstaller.cs");
  assert.match(editor,/ValidateNavigationRoutes\(residents\)/);
  assert.match(editor,/private static void ValidateNavigationRoutes/);
  assert.match(editor,/NavMesh\.SamplePosition\(resident\.transform\.position/);
  assert.match(editor,/NavMesh\.SamplePosition\(destination/);
  assert.match(editor,/NavMesh\.CalculatePath\(spawn\.position, goal\.position/);
  assert.match(editor,/route\.status != NavMeshPathStatus\.PathComplete/);
  assert.match(editor,/resident\.GetComponent<NavMeshAgent>\(\)/);
  assert.doesNotMatch(editor,/SaveScene\(/);
});

test("unreachable destination retries are bounded and no obstacle-cutting fallback exists for NavMesh residents",()=>{
  const actor=source("Gameplay/FirstNeighborhood/FirstNeighborhoodResidentAgent.cs");
  assert.match(actor,/if \(_navigation != null && _navigation\.enabled\)/);
  assert.match(actor,/if \(!_navigation\.isOnNavMesh\)/);
  assert.match(actor,/_nextPathAttemptTime = Time\.time \+ 2f/);
  assert.match(actor,/_navigation\.SetDestination\(navGoal\.position\)/);
  assert.match(actor,/_destinationPending = false/);
  assert.match(actor,/if \(_navigation\.isPathStale\)/);
  assert.match(actor,/_navigationWarningShown/);
  assert.match(actor,/Vector3\.MoveTowards\(transform\.position/);
  const branch=actor.split("if (_navigation != null && _navigation.enabled)")[1];
  assert.ok(branch.indexOf("return;")<branch.indexOf("Vector3 delta=_destination-transform.position"));
});

test("imported resident humanoid animations do not override navigation movement",()=>{
  const motion=source("Presentation/AfriLifeCharacterMotionBridge.cs");
  assert.match(motion,/animator\.applyRootMotion = false/);
  assert.match(motion,/animator\.SetFloat\(_speedHash, speed\)/);
  assert.match(motion,/animator\.SetBool\(_movingHash, speed > 0\.025f\)/);
});
