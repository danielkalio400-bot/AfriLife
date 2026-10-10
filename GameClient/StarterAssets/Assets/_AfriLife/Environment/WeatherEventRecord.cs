using System;

namespace AfriLife.Environment
{
    [Serializable]
    public sealed class WeatherEventRecord
    {
        public string EventId = string.Empty;
        public string WeatherStateId = string.Empty;
        public string EventType = string.Empty;
        public double Severity01;
        public string Status = "active";
        public long StartedAtUnixSeconds;
        public long EndedAtUnixSeconds;
    }
}
