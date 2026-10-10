# Bulk 20 - Rail system foundation

This bulk implements Phase 33 of the AfriLife master specification as a high-level transport/economy system.

## Added
- Rail stations.
- Passenger and freight train categories.
- Routes and schedules.
- Passenger tickets.
- Driver and conductor assignments.
- Rail depots.
- Train repair lifecycle.
- Rail-crossing state.
- Delay state.
- Backend routes/tests and persistence tables.

## Master-spec alignment
Phase 33 lists stations, passenger trains, freight trains, tickets, schedules, drivers, conductors, rail depots, repairs, rail crossings and delays.

## Safety boundary
The rail system models service state, schedules and economy only. It does not include real train-driving procedure, signal-operation instructions, crossing bypass, rail sabotage or security-evasion methods.

## Production boundary
There is no final train physics, rail-network scene content, route pathfinding, live rail data, real schedules, real ticketing integration or real signaling/control system.
