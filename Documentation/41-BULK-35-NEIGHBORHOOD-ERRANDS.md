# AfriLife Bulk 35 — Optional neighborhood errands and repeat-safe progression

This bulk extends the previously built walkable day-one prototype. It adds four optional one-per-day activities that operate on the **existing** player wallet, inventory, needs state, character daily index and local world save. The 17 ordered required daily-life steps remain unchanged.

## Included
- Clinic check-in: requires approaching a newly authored clinic reception marker, costs NGN 120 minor units and raises the local prototype health need by 5.
- Market supplies: at the existing market counter; costs NGN 180 minor units and adds one `prototype-neighborhood-supplies` inventory item.
- Park cleanup: at the existing activity park; pays NGN 75 minor units and raises local comfort by 4.
- Neighbor help: at the existing social marker and in range of an awake named resident; updates saved per-resident interaction counts and the player's social need.
- Stable per-day `FirstNeighborhoodErrandReceipt` stored in `FirstNeighborhoodPrototypeState`, itself saved in the canonical `WorldSaveData` via `LocalWorldSaveStore`. Duplicate rewards and expenses are blocked for the same errand/day.
- An Editor menu item for upgrading existing scene blockouts with the clinic marker, without deleting old scene content.
- Source/Node reference tests for chronology, duplicate idempotency, affordability, proximity and save-restore integrity.

## Scope
These are fictional local prototype costs, not real Nigerian prices or healthcare. The clinic is a game-world interaction only and offers no medical advice. No online economy, medical care simulation, certified Unity scene, device build or full city exists yet.

Run `cd Backend && npm test`. The CI tests are Node tests plus static Unity source checks; compile and Play Mode still require Unity 6 URP on the target platforms.
