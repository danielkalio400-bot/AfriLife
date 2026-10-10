# Bulk 03 - Banking, persistent NPCs, neighborhood and vehicles

This bulk follows the master build order by strengthening core shared systems before large-country expansion.

## Added
- Currency-safe bank account and transfer foundation.
- Education/qualification state.
- Persistent NPC runtime state, schedules and memory records.
- Home-storage container/service.
- First-neighborhood service/state model.
- Vehicle ownership, fuel, mileage, condition and maintenance foundation.
- Core interaction handlers for eating, drinking, showering and sleeping.
- Expanded save data for bank accounts, education, vehicles, neighborhoods and persistent NPCs.
- Prototype bank, education, neighborhood and vehicle catalogs.
- Backend catalog endpoints/tests.
- Reference banking/NPC/vehicle persistence tables.

## Build-order alignment
The first neighborhood should prove housing, needs, money/banking, jobs, shopping, vehicles, phone/data, utilities, save/load and persistent NPCs before large Nigeria/Ghana expansion.

## Production boundary
This still does not create final 3D roads, traffic AI, vehicle physics, workplaces, schools, bank branches, crowds or full neighborhood art. Banking is local simulation logic, not real financial infrastructure. Vehicle systems are high-level game state and maintenance logic; detailed driving physics belongs in the Unity project after the real project/editor configuration exists.
