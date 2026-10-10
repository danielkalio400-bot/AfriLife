using System;

namespace AfriLife.World.Weather
{
    [Serializable]
    public sealed class RegionalWeatherState
    {
        public string RegionId = string.Empty;
        public float TemperatureC = 28f;
        public float RainIntensity01;
        public float VisibilityKm = 20f;
        public WeatherHazardType Hazard;
        public bool RoadFloodingRisk;
        public bool PowerFaultRisk;
        public bool FlightDelayRisk;

        public void Normalize()
        {
            RainIntensity01 = Math.Clamp(RainIntensity01, 0f, 1f);
            VisibilityKm = Math.Max(0f, VisibilityKm);
        }
    }
}
