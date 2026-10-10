# Bulk 12 - Emergency services foundation

This bulk implements Phase 25 of the AfriLife master specification as a high-level dispatch and consequence system.

## Added
- Emergency-call intake.
- Dispatch-center incident creation.
- Incident priority.
- Police, ambulance, fire-service, tow-service and roadside-assistance unit types.
- Region-aware unit assignment.
- Scene-management state.
- Hospital-transport and traffic-diversion flags.
- High-level incident lifecycle.
- After-incident reports.
- Backend dispatch service/routes/tests.
- Persistence tables.

## Master-spec alignment
Phase 25 lists emergency calls, dispatch center, police, ambulance, fire service, tow service, roadside assistance, incident priority, unit assignment, scene management, hospital transport, traffic diversion and after-incident reports.

## Safety boundary
This system models dispatch/resource state only. It does not provide tactical violence, dangerous rescue instructions, hazardous firefighting procedures or graphic incident content.

## Production boundary
There is no final emergency-driving AI, siren/audio package, route optimization, live traffic integration or real emergency-service integration yet.
