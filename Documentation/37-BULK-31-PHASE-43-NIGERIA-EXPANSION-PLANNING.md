# AfriLife Bulk 31 — Phase 43 Nigeria expansion planning with hard first-neighborhood gate

**Specification:** Unified Master pp. 59 and 66. The first serious neighborhood loop must work (including save/reload) before large-scale Nigeria/Ghana map construction.

## What exists now
- Source-aligned expansion design plans for Lagos, Abuja, Port Harcourt, Kano, Ibadan and Enugu. Names/IDs are reconciled with `city-catalog.json` and `world-reference/nigeria.json`. Ghana's priority cities remain unchanged.
- City-specific candidate transport, economy, climate, weather and district-type *tags* for future authoring. They are design archetypes, not surveyed real roads, live economics or generated Unity environments.
- Runtime eligibility gate for every step in the original `daily-life-loop.json`, required first-neighborhood services and five additional QA checks covering Android, iOS, Windows, save integrity and streaming budget.
- Internal QA adapter permits evidence recording only by configured reviewer identity. The server registers **no** QA reviewers and exposes exclusively read-only reporting, rejecting POST approval attempts.
- Human-readable missing/passing/failing test matrices for the current first-neighborhood milestone, per-city plans and Unity serializable DTOs.

## Build-order guarantee
The current real repository has no certified completed first-neighborhood loop, no Unity Editor build results and no production art/streets/vehicles. Consequently the default gate is **blocked** and every city says `not-playable`. Even after manual QA evidence is filled, a separately authored Unity city scene and streaming QA would be needed. This bulk prepares Phase 43 without breaking the master build order.

## Required future work
Make an actual first-neighborhood Play Mode scene; wire movement, housing, needs, shopping, paid work, transport, bills, persistent NPCs, phone data, interactions, save and reload. Compile and run on Android/iOS/Windows. Then populate vetted district/transport/industry data and build the large regional worlds. Tests run with `cd Backend && npm test` but do not establish Unity certification.
