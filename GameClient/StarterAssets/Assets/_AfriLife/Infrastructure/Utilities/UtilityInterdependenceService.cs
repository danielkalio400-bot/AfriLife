using System;
using AfriLife.Infrastructure.Power;
using AfriLife.Infrastructure.Telecom;

namespace AfriLife.Infrastructure.Utilities
{
    public sealed class UtilityInterdependenceService
    {
        public void ApplyPowerToTelecom(RegionalPowerState power, RegionalTelecomState telecom)
        {
            if (power == null || telecom == null) return;

            float grid = Math.Clamp(power.SupplyRatio * Math.Clamp(power.DistributionCondition01, 0f, 1f), 0f, 1f);
            if (power.MajorFault) grid = 0f;
            if (power.LoadShedding) grid *= 0.55f;

            telecom.GridAvailability01 = grid;
            telecom.Normalize();
        }

        public float ResolveHomePowerAvailability(RegionalPowerState power, float localDistribution01)
        {
            if (power == null || power.MajorFault) return 0f;
            float distribution = Math.Clamp(localDistribution01, 0f, 1f);
            float availability = Math.Clamp(power.SupplyRatio, 0f, 1f) * distribution;
            if (power.LoadShedding) availability *= 0.55f;
            return Math.Clamp(availability, 0f, 1f);
        }
    }
}
