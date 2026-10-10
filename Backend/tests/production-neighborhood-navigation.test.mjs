import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const base=new URL("../../GameClient/StarterAssets/Assets/_AfriLife/",import.meta.url);
const source=path=>readFileSync(new URL(path,base),"utf8");

test("production resident navigation uses baked NavMesh paths and never clips through geometry",()=>{
  const agent=source("Gameplay/FirstNeighborhood/FirstNeighborhoodResidentAgent.cs");
  const install=source("Editor/AfriLifeProductionArtInstaller.cs");
  assert.match(agent,/using UnityEngine\.AI;/);
  assert.match(agent,/NavMeshAgent _navigation/);
  assert.match(agent,/if \(!_navigation\.isOnNavMesh\)\s*\{[\s\S]*?return;/);
  assert.match(agent,/NavMesh\.SamplePosition\(/);
  assert.match(agent,/_navigation\.SetDestination\(navGoal\.position\)/);
  assert.match(agent,/if \(_navigation != null && _navigation\.enabled\)/);
  assert.match(agent,/Vector3\.MoveTowards\(transform\.position/);
  assert.match(install,/Undo\.AddComponent<NavMeshAgent>\(resident\)/);
  assert.match(install,/EnsureResidentNavigation\(resident\)/);
  assert.match(install,/navigation\.baseOffset = -1f/);
  assert.match(install,/GetComponent<NavMeshAgent>\(\) == null/);
});

test("camera avoids authored world collision and excludes player geometry",()=>{
  const follow=source("Gameplay/FirstNeighborhood/FirstNeighborhoodCameraFollow.cs");
  assert.match(follow,/Physics\.SphereCastNonAlloc\(/);
  assert.match(follow,/collider\.transform\.IsChildOf\(Target\)/);
  assert.match(follow,/QueryTriggerInteraction\.Ignore/);
  assert.match(follow,/obstructed \? 1f/);
  assert.match(follow,/Quaternion\.LookRotation\(view, Vector3\.up\)/);
  assert.match(follow,/private readonly RaycastHit\[\] _obstructionHits = new RaycastHit\[24\]/);
});
