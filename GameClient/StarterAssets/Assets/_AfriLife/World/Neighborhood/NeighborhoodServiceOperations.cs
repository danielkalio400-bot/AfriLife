using System;
using AfriLife.Infrastructure.Power;
using AfriLife.Infrastructure.Telecom;

namespace AfriLife.World.Neighborhood
{
    public sealed class NeighborhoodServiceOperations
    {
        public void ApplyInfrastructure(
            NeighborhoodServiceRuntimeState service,
            RegionalPowerState power,
            RegionalTelecomState telecom)
        {
            if (service == null) return;

            float powerAvailability = power == null
                ? 1f
                : Math.Clamp(power.SupplyRatio * power.DistributionCondition01, 0f, 1f);

            float telecomAvailability = telecom?.EffectiveService01() ?? 1f;

            service.UtilityAvailability01 = service.Type switch
            {
                NeighborhoodServiceType.Bank => Math.Min(powerAvailability, telecomAvailability),
                NeighborhoodServiceType.Clinic => powerAvailability,
                NeighborhoodServiceType.Hospital => powerAvailability,
                NeighborhoodServiceType.FuelStation => powerAvailability,
                NeighborhoodServiceType.Shop => Math.Min(1f, powerAvailability + 0.2f),
                _ => powerAvailability
            };
            service.Normalize();
        }
    }
}
