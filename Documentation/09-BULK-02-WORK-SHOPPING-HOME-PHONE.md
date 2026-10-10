# Bulk 02 - Work, shopping, home and phone foundation

## Added
- Player character runtime state.
- Job definitions, employment state and work-shift rewards.
- Product catalog and purchase service.
- Household bill state/payment service.
- Mobile phone and data-plan state.
- Appliance power/condition rules tied to home electricity.
- NPC daily schedules and schedule resolver.
- Travel request/progress foundation.
- Expanded save state for character, employment, phone, bills and active trip.
- Prototype job/shop/bill contracts and backend endpoints.
- Reference database tables for employment, bills and phone state.

## Gameplay loop coverage
This moves the first serious loop closer to:
wake -> hygiene -> eat -> phone/data -> travel -> work -> earn -> shop -> bills -> home -> sleep -> save/reload.

## Production boundary
Prices and pay rates in the prototype catalogs are game-balance placeholders, not claims about real wages or market prices. Transport is still a state model rather than a finished driving/public-transit system. Jobs do not yet include full workplaces, schedules, promotion, taxation or employer simulation. Home appliances are logic foundations without final 3D interactions or utility-grid simulation.
