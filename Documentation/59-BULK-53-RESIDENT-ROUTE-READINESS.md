# AfriLife Bulk 53 — Resident Route Readiness and Animation Authority

**Committed scope:** Production-scene navigation validation and movement integration. This bulk does **not** ship realistic school or neighborhood models, textures, animation clips, Unity-generated assets or installable apps.

## Changes

- **AfriLife > Production Art > Validate Open Scene** now verifies a baked walkable NavMesh close to each installed resident, plus complete connected routes from every resident to the authored home, market, park and neighbor locations. A NavMeshAgent without reachable routes is no longer reported as navigation-ready.
- Production resident agents continue to **hold position rather than clipping through buildings** if navigation is unavailable. Failed route calculation is retried at most once per two seconds, so a temporary missing destination does not permanently strand a resident. Diagnostic warnings are throttled until navigation recovers.
- Live agent speed follows each resident's configured speed. Existing resident schedules, identifiers, proximity conversation logic and persistent world progress are unchanged.
- Imported player/resident Humanoid Animators use visual-only motion; root motion is disabled to avoid racing the persistent gameplay actor or NavMeshAgent.

## Real-editor acceptance

Open the existing realistic neighborhood scene in Unity 6 URP, import properly licensed characters and environment prefabs and install them using the Production Art menu. Bake the actual walkable road/sidewalk/compound surfaces with Unity Navigation, including doorways and any necessary links. Run **Validate Open Scene** to detect unusable or disconnected service routes. Then press Play and test resident journeys between home, market, park and gathering point; check dialogue proximity and save/restore. Visually validate animation, collisions, character feet at ground level, roof occlusion and acceptable device FPS on Android/iOS/Windows.

The route test uses current game authored service coordinates. If the production neighborhood is moved or redesigned, update those gameplay locations and the route validation targets together. Successful GitHub Node tests are source checks only, not an actual NavMesh bake or Unity Editor compilation.
