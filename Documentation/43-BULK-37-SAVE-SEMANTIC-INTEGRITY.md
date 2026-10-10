# AfriLife Bulk 37 — Semantic local-save integrity and conflicting checkpoint protection

The previous two-slot store verified that JSON bytes matched an SHA-256 checksum. That alone does not establish that the daily-life state is internally consistent or that two valid files represent the **same** world.

## Implemented
- A single Unity `FirstNeighborhoodSaveIntegrity` validator checks the first-neighborhood prototype's ordered steps, completed-day bounds, unique and site-correct one-per-day errand receipts, nonnegative receipt wallet balances, unique resident entries and finite saved coordinates. Legacy worlds without the prototype are accepted.
- `LocalWorldSaveStore` runs this check on deserialized data **before** normalizing potentially invalid entries, and before writing a snapshot. If both checked slots represent different world IDs, or both claim the same generation but disagree, it fails closed, retaining both files for manual recovery.
- A Node reference implementation and fault-injection tests cover two-world conflicts, checksum-valid malformed saves, duplicate errands, same-generation conflicts, and single-corrupted-slot rollback.

## Verification boundaries
These rules preserve local data integrity; SHA-256 is not a signature or protection from a device owner modifying local files. No Unity runtime or device build ran in CI. Recovery still requires the user to preserve and manually inspect files if *both* save slots fail. Cross-device saves, online synchronization and nationwide-world progression remain unfinished.
