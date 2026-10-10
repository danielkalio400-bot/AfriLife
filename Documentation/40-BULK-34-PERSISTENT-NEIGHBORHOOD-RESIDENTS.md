# AfriLife Bulk 34 — Persistent resident prototype and physical NPC conversation

Extends Bulk 33's original blockout, walkable avatar, interaction markers and local save. No second inventory/economy/world store was added.

The Unity demo now seeds exactly three fictional residents in the existing `WorldSaveData.PersistentNpcs` array using stable IDs and `NpcRuntimeState`. A simple daypart routine based on saved world elapsed time drives schedule and visual agent destinations. The scene builder adds distinct resident capsules and signs. The existing HUD requires the player to stand within the neighbor marker **and** a resident capsule's conversation radius before the NPC-talk activity can complete.

The encounter saves a per-resident interaction count in `FirstNeighborhoodPrototypeState` and a bounded reputation value in the existing `NpcProfile`; these fields use the existing `LocalWorldSaveStore`. Calls without the resident ID or without a saved resident record fail. Automated Node reference tests, Unity-source assertions and contracts cover identity, schedule, proximity and reload invariants.

**Boundaries:** no Unity Play Mode/device validation, no NavMesh navigation or collision avoidance, no AI conversation, no real NPC crowds, no production world networking, and the national expansion release gate stays blocked. The three people are fictional and the scene remains a primitive blockout.

The resident motion is a visual simulation, not a pathfinding/vehicle model. Unity Editor compilation still must be verified with the local Unity project.
