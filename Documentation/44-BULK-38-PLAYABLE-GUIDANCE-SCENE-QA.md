# AfriLife Bulk 38 — Neighborhood waypoint guidance and Unity Editor structural QA

Built on the walkable Lagos prototype and canonical single-world save. The demo HUD provides the next authored destination, cardinal direction and planar straight-line distance in metres; this is **not** route planning or transit ETA. It uses the same site markers that gate scripted daily-life interactions.

The Unity Editor scene-upgrade path previously returned early if the player GameObject was present, skipping missing markers or residents. The upgrade now retains the player object and repairs missing interactables idempotently. A new menu action, **AfriLife → Validate First Neighborhood Prototype Scene**, checks the player controller, HUD, main camera, seven site markers, and three fictional resident identities. No automatic repair overwrites an existing authored scene.

The Lagos-only prototype constructor now **rejects** saves whose player belongs to another country or city before seeding NPCs, assigning the player country, or crediting starter funds. It does not silently convert Ghana or another Nigerian city's world.

Node tests verify reference guidance math, duplicate/missing scene diagnostics and source wiring. Unity Editor structural checks still need to be **run in Unity 6**; Play Mode, mobile/PC compilation, asset QA and a separately authored Ghana scenario remain outstanding.
