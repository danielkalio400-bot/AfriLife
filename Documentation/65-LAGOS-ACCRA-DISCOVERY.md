# AfriLife: Lagos and Accra playable scene improvements

Only **Lagos (200 km² target)** and **Accra (128 km² target)** are in this first-stage city build. Their existing Unity scenes are small procedural prototypes; target areas are **not built**.

A new `AfriLifeCityDiscoveryHud` component attaches non-destructively to each scene's existing city identity root when running the normal city builder. It detects actual `FirstNeighborhoodInteractionPoint` components using their physical interaction radius, tracks distinct discovered sites per play session, displays an expandable exploration checklist, labels Nigeria with NGN and Ghana with GHS, and never grants fictional money, renames the canonical account, or alters the Lagos-only daily-life ledger.

The original saved actors, buildings, scenes and player state remain untouched. Ghana's old Lagos-only daily-life HUD remains off until Ghana-native gameplay and proper GHS wallet transaction services are implemented. Location-specific discovery is **not persisted** across sessions in this bulk; it is an exploration test rather than a completed economy.

Use the existing `Build-AfriLife-Cities.ps1` installer to sync and retrofit both local city scenes. Verify the installation logs and then inspect Lagos or Accra in Unity Play Mode. Only GitHub source-contract tests run in CI; Unity Editor compilation and actual Play Mode should be checked locally.
