using System;
using System.Collections.Generic;
using System.Linq;

namespace AfriLife.Transport.PublicTransit
{
    public sealed class PublicTransitOperationsService
    {
        public int EffectiveDelayMinutes(
            PublicTransitVehicleState vehicle,
            IEnumerable<TransitDisruptionState> disruptions,
            long worldUnixSeconds)
        {
            if (vehicle == null) return 0;
            vehicle.Normalize();

            int delay = vehicle.DelayMinutes;
            if (disruptions == null) return delay;

            foreach (var disruption in disruptions.Where(value =>
                value != null &&
                value.RouteId == vehicle.RouteId &&
                worldUnixSeconds >= value.StartsAtUnixSeconds &&
                (value.EndsAtUnixSeconds <= 0 || worldUnixSeconds < value.EndsAtUnixSeconds)))
            {
                delay += Math.Max(0, disruption.DelayMinutes);
                if (disruption.ServiceSuspended) vehicle.InService = false;
            }

            return delay;
        }
    }
}
