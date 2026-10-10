using System;

namespace AfriLife.Environment
{
    [Serializable]
    public sealed class RegionalWeatherState
    {
        public string WeatherStateId = string.Empty;
        public string CountryId = string.Empty;
        public string RegionId = string.Empty;
        public WeatherConditionType PrimaryCondition;
        public SeasonType Season;
        public double RainIntensity01;
        public double StormIntensity01;
        public double HeatIntensity01;
        public double FogIntensity01;
        public double FloodingIntensity01;
        public double WindIntensity01;
        public double WetRoads01;
        public long UpdatedAtUnixSeconds;
    }
}
