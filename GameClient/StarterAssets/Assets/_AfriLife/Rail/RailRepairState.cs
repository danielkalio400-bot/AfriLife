using System;

namespace AfriLife.Rail
{
    [Serializable]
    public sealed class RailRepairState
    {
        public string RepairId = string.Empty;
        public string TrainId = string.Empty;
        public string DepotId = string.Empty;
        public string RepairTag = string.Empty;
        public string Status = "scheduled";
        public long ScheduledAtUnixSeconds;
        public long CompletedAtUnixSeconds;
    }
}
