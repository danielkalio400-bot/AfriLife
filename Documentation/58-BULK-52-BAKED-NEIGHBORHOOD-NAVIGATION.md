# AfriLife Bulk 52 — Baked Neighborhood Navigation and Real-Geometry Camera

## Runtime integration

Three production residents (Ada, Bola, Kwame) receive an Undo-supported NavMeshAgent when imported realistic art is applied. Each agent retains its existing resident identity, behavior, destination and conversation logic. The agent samples a nearby baked walkable NavMesh point and follows Unity's pathfinder; if the agent is not placed on a walkable NavMesh, it **stays still** rather than crossing physical building walls. Non-production blockout scenes without NavMeshAgent preserve their previous simple movement. Navigation mesh data is not generated or claimed to exist in this repository.

The camera-follow component now uses allocation-free-per-frame SphereCastNonAlloc obstruction checks against physical buildings and terrain; ignores the controlled player's own colliders and trigger zones; moves in front of obstruction immediately; otherwise eases between camera positions and looks toward the player.

## Artist/editor workflow

1. Import properly licensed realistic Nigerian/Ghanaian neighborhood, school and resident assets into the local Unity 6 URP project; assign all required entries in the **AfriLife Production Art Profile**.
2. Use **AfriLife > Production Art > Apply Imported Prefabs**, preserving original scene gameplay anchors and Undo.
3. Prepare a **walkable baked NavMesh** for the actual environment using Unity's AI Navigation workflow (install the AI Navigation package if needed), including playable roads, sidewalks, doorways and distinct ground heights. Check resident root/base-offset alignment; existing authored root positions are 1 m above the blockout ground.
4. Use **AfriLife > Production Art > Validate Open Scene**, then Play Mode and observe Ada/Bola/Kwame navigating without walking through buildings, while remaining approachable for dialogue, with errands and save-state unaffected. Observe camera movement around walls, roofs and dense market stalls.
5. Verify real Android/iOS/Windows graphics quality and performance. If navigation cannot reach authored destinations, adjust NavMesh links/geometry and resident placements rather than disabling collision.

## Limits

No Unity Editor was run in this build process. GitHub Node regression tests are source-integration tests only, **not** a NavMesh bake, scene compile, runtime or device validation. No realistic model files, texture files, school mesh assets, animations or binary builds were produced.
