using System;
using System.Collections.Generic;

namespace AfriLife.Infrastructure.Telecom
{
    public sealed class TelecomOperationsService
    {
        public float ApplyOutages(
            RegionalTelecomState state,
            IEnumerable<TelecomOutageState> outages,
            long worldUnixSeconds)
        {
            if (state == null) return 0f;
            state.Normalize();
            float service = state.EffectiveService01();

            if (outages == null) return service;

            foreach (var outage in outages)
            {
                if (outage == null || outage.RegionId != state.RegionId) continue;
                if (worldUnixSeconds < outage.StartsAtUnixSeconds) continue;
                if (outage.EndsAtUnixSeconds > 0 && worldUnixSeconds >= outage.EndsAtUnixSeconds) continue;

                outage.Normalize();
                service *= 1f - outage.Severity01;
            }

            return Math.Clamp(service, 0f, 1f);
        }

        public bool CanRoam(RegionalTelecomState state, string homeCountryId, string visitedCountryId)
        {
            if (state == null || string.IsNullOrWhiteSpace(homeCountryId) || string.IsNullOrWhiteSpace(visitedCountryId))
                return false;
            return state.RoamingEnabled && homeCountryId != visitedCountryId;
        }
    }
}
