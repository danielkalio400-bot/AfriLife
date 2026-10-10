# Bulk 19 - Maritime transport foundation

This bulk implements Phase 32 of the AfriLife master specification as a high-level transportation/economy system.

## Added
- Ports and berth-capacity state.
- Passenger ships, ferries, boats, yachts, cargo ships and oil-tanker categories.
- Maritime routes and voyages.
- Captain and crew assignments.
- Ship-fuel state.
- Vessel maintenance.
- Route weather/disruption state.
- Cargo records and capacity checks.
- Port fees.
- Cross-country maritime-trade records.
- Backend routes/tests and persistence tables.

## Master-spec alignment
Phase 32 lists ports, passenger ships, ferries, boats, yachts, cargo ships, oil tankers, captains, crew, ship fuel, maintenance, weather, cargo, port fees and maritime trade.

## Safety boundary
The implementation models scheduling, resource state and economy. It does not include vessel-control instructions, security/evasion methods, hazardous cargo procedures, or real navigation checklists.

## Production boundary
There is no final vessel physics, ocean simulation, port assets, real shipping schedules, real customs data, real port integrations or live maritime tracking.
