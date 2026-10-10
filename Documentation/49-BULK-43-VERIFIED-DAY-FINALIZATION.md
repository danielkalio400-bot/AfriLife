# AfriLife Bulk 43 — Readback-certified daily-life completion

The first-neighborhood HUD previously marked `_saveVerified` true as soon as the in-memory last step advanced, then called `SavePlayerPosition()` without checking the return value. A failed filesystem write could leave the display claiming completion even though the last verified checkpoint still contained an unfinished day.

The new `FirstNeighborhoodDayCompletionCheckpoint` verifies the **pre-completion saved** state, advances a separately loaded candidate, commits that candidate through the existing alternating SHA-256 save slots, reads it back and verifies world identity, full 17-step ledger and exactly one completed-day increment. Only then does the HUD install the new world and mark the day complete. Failure preserves the previous active loop and shows a warning. This does not silently delete old save slots or fabricate progression.

`LocalWorldSaveStore.Save` now checks semantic validity **before** calling `Normalize`, so corrupt daily-life ledgers cannot be silently truncated and rechecksummed on write.

Automated Node reference tests cover successful completion, interrupted writes, stale readbacks, conflicting world identity, unmodified money/landmarks, repeated attempts, and Unity source wiring. Real Unity Editor validation, Play Mode, mobile/Windows device filesystem QA, cloud recovery and distributed transaction handling are still outstanding.
