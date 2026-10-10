# Bulk 18 - Airports and aviation foundation

This bulk implements Phase 31 of the AfriLife master specification as high-level transportation simulation.

## Added
- Airport state.
- Passenger check-in.
- Baggage records.
- High-level security-screening result state.
- Immigration checkpoint link.
- Boarding state.
- Aircraft and interior-zone DTOs.
- Commercial flights, private jets, helicopters and cargo flight categories.
- Pilot, cabin-crew and ground-staff assignments.
- Fuel/condition state.
- Aircraft maintenance.
- Hangar state.
- Air-cargo records.
- Delay and cancellation state.
- Backend routes/tests and persistence tables.

## Master-spec alignment
Phase 31 lists airports, check-in, baggage, security, immigration, boarding, aircraft interiors, commercial flights, private jets, helicopters, pilots, cabin crew, ground staff, fuel, maintenance, hangars, air cargo and delays/cancellations.

## Safety boundary
Airport security and aircraft operations are abstract state only. No security-bypass guidance, dangerous aviation procedure, flight-control instruction or real operational checklist is included.

## Production boundary
There are no final airport/aircraft assets, flight-physics implementation, real airline schedules, real passenger data, real airport APIs or real aviation operations integrations.
