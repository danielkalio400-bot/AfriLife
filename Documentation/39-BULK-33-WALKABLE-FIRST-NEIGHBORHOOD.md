# AfriLife Bulk 33 — Walkable first-neighborhood blockout and proximity interactions

## Added
- Unity `CharacterController` movement for an original capsule avatar with keyboard and mobile GUI directional controls.
- Smooth third-person overhead camera follow, physically placed six prototype interaction markers (home, market, workplace, bank, park, neighbor) and world-space labels.
- 17-step day-one scripted loop now checks player proximity to a matching authored interaction marker **before** invoking the existing `FirstNeighborhoodPrototypeLoop.TryAdvance`.
- `WorldSaveData.FirstNeighborhoodPrototype` now retains avatar x/z position and restores it on reload; timed local autosave preserves progress if the player moves.
- Editor menu `AfriLife > Build First Neighborhood Prototype Scene` installs the walk layer on new blockouts. Separate `AfriLife > Add Walkable Interaction Layer` upgrades existing scene assets without overwriting their content.
- Tests guard input implementation, authoritative order of proximity versus gameplay actions, save restore, economy-source reuse and prerequisite consistency.

## Scope and limitations
This is an **interactive graybox walk demo**, not free-roaming Lagos, real physical jobs/shopping, complex NPC AI, cars, or real banking. The markers are simple Unity primitives and trigger objects; the financial and needs transactions are the same local world-state methods from Bulk 32. Completing this prototype **does not certify the Phase 43 map expansion gate**.

No Unity Editor or device QA is available in this runner. Node CI validates contracts and code organization but not the scene's runtime physics or visual presentation. Android/iOS/Windows require in-editor validation. No ZIPs, backups or generated Unity caches checked into source control.
