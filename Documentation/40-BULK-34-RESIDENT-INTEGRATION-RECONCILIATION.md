# AfriLife Bulk 34 — Resident system reconciliation

The repository received two parallel implementations for the same resident milestone. They are merged into **one** first-neighborhood system: `FirstNeighborhoodResidentService` governs all three resident records in canonical `WorldSaveData.PersistentNpcs`, `FirstNeighborhoodResidentAgent` renders and moves each character, and `FirstNeighborhoodPrototypeHud` sends physical nearest-resident IDs to the existing `FirstNeighborhoodPrototypeLoop.TryAdvance(..., residentId)`.

The competing single-resident `FirstNeighborhoodResidentDirector` and separate scene builder were removed. Scene generation now delegates once to `FirstNeighborhoodWalkLayerBuilder.AddResidents()`. This avoids contradictory agent APIs (`MoveTo` vs `SetDestination`), duplicate NPC spawns, and a conversation step that failed because it did not supply the required resident ID.

The resident interaction still requires both the neighborhood site and proximity to a non-sleeping resident. Existing wallet, daily-life action ordering, save and reload and Phase 43 gated expansion remain unchanged.

Verification: `cd Backend && npm test`. Unity Editor and mobile builds remain unverified.
