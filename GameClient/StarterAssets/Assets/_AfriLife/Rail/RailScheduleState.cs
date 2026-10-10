using System;

namespace AfriLife.Rail
{
    [Serializable]
    public sealed class RailScheduleState
    {
        public string ScheduleId = string.Empty;
        public string RouteId = string.Empty;
        public string TrainId = string.Empty;
        public long ScheduledDepartureUnixSeconds;
        public long ScheduledArrivalUnixSeconds;
        public string Status = "scheduled";
    }
}
