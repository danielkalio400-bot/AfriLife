# Bulk 05 - First-neighborhood runtime orchestration

This bulk follows the master specification's build-order gate: prove one excellent neighborhood and a complete daily-life loop before expanding the national map.

## Added
- City runtime profiles for initial Nigerian and Ghanaian priority cities.
- Utility-service state and power-to-telecom dependency logic.
- Public-transit stops, timetable entries and runtime queries.
- Traffic signal/runtime state and travel-time effects.
- Weather impacts on roads, power and telecom.
- First-neighborhood runtime snapshot/orchestrator.
- Versioned city, transit and neighborhood-runtime contracts.
- Backend read-only runtime endpoints and tests.
- Persistence tables for city profiles, routes, timetables and neighborhood snapshots.

## Master-spec alignment
The master build phases call for a first neighborhood with housing, shops, restaurant, gym, bank, clinic/hospital, police, fuel, workplace, roads, streetlights, sidewalks, NPC traffic, pedestrians, basic services and day/night. The following phases add vehicle maintenance, traffic and road events, public transport with routes/timetables/fares, telecom coverage/outages/roaming and electricity generation/distribution/metering/load management.

## Production boundary
This is runtime architecture and balance data, not final 3D streets, driving physics, crowd animation, live road geometry or finished public-transport art. Real city content must be authored and validated in Unity after the actual project/scenes exist.
