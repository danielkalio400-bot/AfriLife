# Bulk 13 - Property incident, recovery and investigation foundation

This bulk implements Phase 26 of the AfriLife master specification as a consequence, reporting and recovery system.

## Added
- Property-incident categories for phone, wallet, vehicle, package, shop, home and other property theft.
- Stolen-item records.
- CCTV observation metadata.
- Witness records.
- Police-report records.
- High-level investigation lifecycle.
- Property recovery records and return-to-owner state.
- Insurance-claim lifecycle.
- Backend services/routes/tests and persistence tables.

## Master-spec alignment
Phase 26 lists phone theft, wallet theft, vehicle theft, package theft, shop theft, home burglary, property theft, CCTV, witnesses, police reports, stolen-item records, recovery, insurance claims and investigation.

## Safety boundary
The feature only represents incidents after they occur, plus reporting, evidence metadata, recovery and consequences. It contains no instructions for committing theft, bypassing security, concealing stolen property or evading investigation.

## Production boundary
There is no detailed criminal AI, security-bypass simulation, real CCTV integration, real police database or real insurance processing. These are fictional game-state foundations only.
