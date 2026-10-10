# AfriLife Bulk 34 — Physical resident encounters in the first neighborhood

Added a named **fictional** local neighborhood resident to the Unity prototype, reusing the existing `NpcRuntimeState` collection in `WorldSaveData.PersistentNpcs`.

The scene builder creates an original capsule resident without overwriting existing authored resident GameObjects. The resident walks between scripted home, workplace and neighbor positions based on the day-one step. Its identity, city, current location/activity and employment flag are stored on the canonical NPC record; no separate economy ledger is created.

The daily-life conversation step requires BOTH the existing neighbor marker range and actual proximity to the spawned resident. The UI records the conversation only once per demo day, and progress is saved through the same LocalWorldSaveStore path. Automated Node static integration tests verify the physical, persistence and progression gates.

**Remaining:** Real navmesh pathfinding, autonomous schedules, conversation trees, audio, character art, crowd population, a full playable city, Unity compilation and mobile/PC builds. Completing this one scripted encounter does **not** complete the Phase 43 expansion gate.
