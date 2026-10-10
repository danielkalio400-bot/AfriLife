# Bulk 06 - Transport, telecom and power operations

This bulk implements the next master-spec layers after the first-neighborhood runtime.

## Added
- Road-event types/state and road-event application.
- Junction and parking runtime state.
- Public-transit vehicle state, disruptions and delay handling.
- Telecom outage state plus regional outage/roaming operations.
- Power-restoration tasks, repair progress and load-management logic.
- Neighborhood service runtime capacity and infrastructure dependency logic.
- Versioned road, telecom, power and service-operation contracts.
- Backend runtime endpoints/tests.
- Persistence tables for road events, transit disruptions, telecom outages and restoration tasks.

## Master-spec alignment
The master phases call for traffic AI, signals, junctions, roundabouts, parking, construction, flooded roads, incidents, towing, closures and tolls; public transport with routes/timetables/fares/passenger behavior; telecom towers/fiber/coverage/congestion/outages/roaming; and electricity generation/distribution/load management/failures/repair crews/restoration.

## Production boundary
These are deterministic simulation foundations. They are not final vehicle physics, rendered traffic crowds, real transport operator schedules, real telecom billing or an electrical-engineering simulator. Volatile real-world fares, tariffs and service data remain outside core code.
