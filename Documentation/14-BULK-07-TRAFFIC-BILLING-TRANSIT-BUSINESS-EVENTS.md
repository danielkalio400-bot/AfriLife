# Bulk 07 - Traffic agents, utility billing, transit passengers, businesses and persistent events

This bulk continues the master specification's Phase 15-18 work while tying it back into persistent neighborhood simulation.

## Added
- Traffic-agent types and state for private, commercial, public, emergency and service vehicles.
- High-level traffic decision service using signals, road condition and congestion.
- Utility meter readings, billing plans and invoice/payment logic.
- Transit passenger state, boarding/alighting and driver-shift models.
- Neighborhood business runtime state and service-capacity logic.
- Persistent world-event records/log for durable incidents and consequences.
- Versioned traffic, billing, passenger and business contracts.
- Backend read-only contract endpoints/tests.
- Persistence tables for traffic agents, invoices, passengers, businesses and world events.

## Master-spec alignment
Phase 15 requires traffic AI, lights, junctions, parking, construction/flooded roads, incidents, towing, closures and tolls. Phase 16 adds drivers, conductors and passenger behavior. Phase 17 adds telecom billing and outages. Phase 18 adds metering, billing, failures, repair crews and restoration. This bulk provides shared runtime interfaces for those systems rather than separate one-off mechanics.

## Production boundary
Traffic decisions are simulation abstractions, not final vehicle-driving physics. Utility prices remain balance data, not real tariffs. Passenger behavior is a state model, not final crowd animation or pathfinding. Businesses are simulation state and not yet the complete ownership/supplier/tax systems of later phases.
