# AfriLife Architecture

AfriLife is a standalone Unity 6 + URP living-world simulation targeting Android, iOS and Windows PC.

## Layered world simulation
- Active district: full physics, pedestrians, traffic, interiors and detailed AI.
- Neighboring region: reduced-detail simulation.
- Far region: statistical simulation for population, jobs, businesses, prices, utilities, traffic and major NPCs.

## Persistence
Persistent IDs cover characters, vehicles, homes, businesses, accounts, devices, court/police cases, shipments and infrastructure. Save data records durable state changes rather than serializing the whole world every frame.

## Event propagation
A shared event bus links infrastructure, economy, NPC and public-service consequences. Example: power failure -> telecom backup -> fuel consumption -> congestion -> business impact -> technician dispatch -> restoration.
