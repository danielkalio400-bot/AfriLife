using System;

namespace AfriLife.Rail
{
    [Serializable]
    public sealed class RailDelayState
    {
        public string DelayId = string.Empty;
        public string ScheduleId = string.Empty;
        public string ReasonTag = string.Empty;
        public int DelayMinutes;
        public bool Resolved;
    }
}
