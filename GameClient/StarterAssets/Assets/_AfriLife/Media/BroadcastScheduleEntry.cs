using System;

namespace AfriLife.Media
{
    [Serializable]
    public sealed class BroadcastScheduleEntry
    {
        public string ScheduleId = string.Empty;
        public string OutletId = string.Empty;
        public string NewsId = string.Empty;
        public long StartsAtUnixSeconds;
        public int DurationMinutes;
        public string Status = "scheduled";
    }
}
