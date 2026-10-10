# AfriLife Bulk 36 — Two-slot verified local save recovery

## Data-loss problem resolved
The original `LocalWorldSaveStore.Save` wrote a .tmp file and then **deleted the only old save** before moving the new one into place. A crash, storage exhaustion, or failed move could destroy progress. `LoadOrCreate` also silently created a new world when an existing file was corrupt.

The local save store now writes alternating `slot-a` / `slot-b` checkpoint envelopes, with SHA-256 checksums over the serialized world JSON and monotonically increasing generations. Every write stages and verifies a temporary file, flushes it to storage, replaces only the **inactive** slot, and verifies after promotion. The previously valid slot remains available if the write is interrupted. Reading picks the newest valid slot and falls back to the older slot if one is corrupted.

Existing `afrilife-local-world.json` saves can be read and migrated without deleting the legacy file. A different world ID cannot silently overwrite existing progress. If **all** existing files are corrupt or unreadable, the API refuses to mint a new character in their place: the Unity HUD displays a recovery warning, and data can be preserved for further manual recovery.

## Tests and scope
Node reference fault-injection tests cover corruption, interrupted commit, legacy migration, world-ID mismatches, and fail-closed errors. Unity source assertions verify slot management and save/reload checks. This is offline local persistence, not device/cloud encryption, multiplayer or cross-device synchronization. Unity 6 Editor, Android/iOS and Windows filesystem behavior still requires real device QA. The Phase 43 expansion gate is **not** cleared by these tests.
