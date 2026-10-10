using System;

namespace AfriLife.Aviation
{
    [Serializable]
    public sealed class FlightDisruptionState
    {
        public string DisruptionId = string.Empty;
        public string FlightId = string.Empty;
        public string Type = "delay";
        public string ReasonTag = string.Empty;
        public int DelayMinutes;
        public bool Resolved;
    }
}
