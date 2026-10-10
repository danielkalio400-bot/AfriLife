using System;

namespace AfriLife.Health
{
    public sealed class HealthcareOperationsService
    {
        public float EffectiveCapacity01(HealthcareFacilityState facility)
        {
            if (facility == null) return 0f;
            facility.Normalize();
            if (!facility.Open || facility.Capacity <= 0) return 0f;

            float staffing = facility.Staffing.Availability01();
            float power = facility.EffectivePower01;
            float supplies = facility.MedicalSupplyAvailability01;
            return Math.Clamp(Math.Min(staffing, Math.Min(power, supplies)), 0f, 1f);
        }

        public bool CanAcceptVisit(HealthcareFacilityState facility)
        {
            if (facility == null) return false;
            facility.Normalize();
            return EffectiveCapacity01(facility) > 0.15f &&
                   facility.Occupancy < facility.Capacity;
        }
    }
}
