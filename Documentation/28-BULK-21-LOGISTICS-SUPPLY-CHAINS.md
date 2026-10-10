# Bulk 21 - Logistics and supply-chain foundation

This bulk implements Phase 34 from the AfriLife master specification.

## Added
- Warehouses.
- Truck logistics.
- Links for ports, rail freight and air cargo transport modes.
- Couriers.
- High-level customs clearance state.
- Distribution centers.
- Inventory movement records.
- Delivery tracking.
- Supply-shortage state.
- Alternative supplier discovery.
- Fuel-dependency capacity effects.
- Backend routes/tests and persistence tables.

## Master-spec alignment
Phase 34 lists warehouses, trucks, ports, rail freight, air cargo, couriers, customs, distribution centers, inventory movement, delivery tracking, supply shortages, alternative suppliers and fuel dependency.

## Safety boundary
Customs and freight are administrative/economic state only. The implementation contains no smuggling guidance, inspection bypass, evasion, sabotage or hazardous-cargo procedures.

## Production boundary
There is no final pathfinding, physical warehouse gameplay, real carrier integration, live customs data, real shipment tracking, real supplier APIs or real logistics company data.
