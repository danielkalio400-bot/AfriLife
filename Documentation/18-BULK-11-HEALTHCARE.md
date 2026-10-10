# Bulk 11 - Healthcare foundation

This bulk implements Phase 24 from the AfriLife master specification at a high-level, non-graphic simulation layer.

## Added
- Clinics, hospitals and emergency-department facility types.
- Pharmacy, laboratory and imaging-center foundations.
- Ward capacity.
- High-level care paths including surgery as non-graphic state only.
- Rehabilitation and maternity service state.
- Blood-service inventory as abstract capacity units.
- Mortuary facility type without graphic content.
- Hospital grid/backup-power state.
- Healthcare staffing roles and availability.
- Ambulance availability and dispatch state.
- Patient-visit queue/status foundations.
- Medical supply-chain shipments.
- Backend healthcare service/routes/tests.
- Persistence tables.

## Master-spec alignment
Phase 24 lists clinics, hospitals, emergency departments, ambulances, pharmacies, labs, imaging, wards, surgery at high level, rehabilitation, maternity, blood services, morgue, hospital power backup, staffing and medical supply chains.

## Safety boundary
Healthcare remains high-level game simulation. This repository does not provide medical diagnosis, treatment procedures, dosage guidance, surgery instructions or graphic injury content.

## Production boundary
No final hospital interiors, medical animations, clinical decision engine, real patient records or real health-provider integration exists. Those require separate content production and careful domain review.
