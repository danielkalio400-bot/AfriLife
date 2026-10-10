using System;

namespace AfriLife.Environment
{
    [Serializable]
    public sealed class EnvironmentImpactState
    {
        public string WeatherStateId = string.Empty;
        public string RegionId = string.Empty;
        public double SolarOutputMultiplier = 1d;
        public double FlightDisruption01;
        public double ShipDisruption01;
        public double PowerGridDamageRisk01;
        public double AgriculturalYieldMultiplier = 1d;
        public double RoadGripMultiplier = 1d;
        public long UpdatedAtUnixSeconds;
    }
}
