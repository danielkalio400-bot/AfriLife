using System;

namespace AfriLife.Maritime
{
    [Serializable]
    public sealed class MaritimeWeatherState
    {
        public string WeatherStateId = string.Empty;
        public string RouteId = string.Empty;
        public string ConditionTag = "clear";
        public double DisruptionLevel01;
        public long UpdatedAtUnixSeconds;
    }
}
