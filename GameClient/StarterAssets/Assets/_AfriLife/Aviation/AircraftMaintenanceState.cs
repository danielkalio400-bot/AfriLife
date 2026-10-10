using System;

namespace AfriLife.Aviation
{
    [Serializable]
    public sealed class AircraftMaintenanceState
    {
        public string MaintenanceId = string.Empty;
        public string AircraftId = string.Empty;
        public string MaintenanceTag = string.Empty;
        public string Status = "scheduled";
        public long ScheduledAtUnixSeconds;
        public long CompletedAtUnixSeconds;
    }
}
