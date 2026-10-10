using System;
using AfriLife.Infrastructure.Power;
using AfriLife.Infrastructure.Telecom;
using AfriLife.Transport.Traffic;
using AfriLife.World.Weather;

namespace AfriLife.World.Neighborhood
{
    [Serializable]
    public sealed class NeighborhoodRuntimeSnapshot
    {
        public string NeighborhoodId = string.Empty;
        public RegionalPowerState Power = new();
        public RegionalTelecomState Telecom = new();
        public TrafficRuntimeState Traffic = new();
        public RegionalWeatherState Weather = new();
        public int ActivePersistentNpcs;
        public int ActiveHouseholds;
        public int OpenServices;
        public long WorldUnixSeconds;
    }
}
