# AfriLife Bulk 50 — Realistic Nigerian/Ghanaian Character and World Integration

**Status:** Production-art Unity integration code is committed. It does not ship realistic art models or replace an installed local Unity project automatically.

### Content standard

Import original or properly licensed, realistic, rigged **Humanoid** character prefabs for the player, Ada, Bola and Kwame, reflecting Nigerian and Ghanaian residents without reducing identities to stereotypes. Include authentic hairstyles, clothing, skin tones, proportions, appropriate school/civic/professional attire where relevant, and facial/locomotion animations. Set FBX **Rig > Animation Type: Humanoid**, assign usable Animator Controllers, and use Unity 6 URP-compatible PBR materials with mobile LODs.

Import an authored, realistic neighborhood prefab (with colliders) containing roads, drainage, walkable surfaces, homes, markets, workplaces, banking and clinical spaces, vegetation, signboards and period-appropriate infrastructure. Preserve gameplay landmark placements and collision-free paths, including the starting character near (-11, 0, -5.6). School grounds, students and teachers require authored educational locations and additional functionality; this bulk does not fabricate a finished school system.

### Application steps

1. Open the actual Unity 6 URP project, import verified art under your own artist-managed paths.
2. Create **Assets > Create > AfriLife > Production Art Profile**, assign all five required prefab references (player, Ada, Bola, Kwame, neighborhood). Exactly one profile per game project.
3. Open saved scene **Assets/_AfriLife/Scenes/FirstNeighborhoodPrototype.unity**.
4. Choose **AfriLife > Production Art > Apply Imported Prefabs**. The tool preflights all assets and key gameplay actors before mutation, uses real prefab instances, preserves existing authored production objects, deactivates legacy 3D blockout geometry, hides the resident capsule renderers, and keeps interaction triggers/scripts intact.
5. Inspect scene in Edit Mode, verify real resident placement and collisions, then save explicitly. **AfriLife > Production Art > Validate Open Scene** checks reference presence, not quality.
6. Press Play. Confirm walking, conversations, errands, banking/clinic access, saved position, collision and world clock. Test gamepad and touch. Confirm Animator parameter **Speed** (normalized movement 0–1) and optional **IsMoving** (bool) animate authored controllers. The bridge only writes parameters that exist; it does not create animations.
7. Measure Android/iOS/Windows builds on real hardware. Require stable FPS, no missing materials, manageable draw calls, LODs and device-appropriate texture residency.

This code does not include production art, textures, FBX models, Unity-generated metadata, binaries or validated Unity Editor/device test results. The prior blockout is retained but hidden after integration so original authored world gameplay can be inspected/recovered.
