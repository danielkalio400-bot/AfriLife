using System;

namespace AfriLife.Maritime
{
    [Serializable]
    public sealed class VesselMaintenanceState
    {
        public string MaintenanceId = string.Empty;
        public string VesselId = string.Empty;
        public string MaintenanceTag = string.Empty;
        public string Status = "scheduled";
        public long ScheduledAtUnixSeconds;
        public long CompletedAtUnixSeconds;
    }
}
