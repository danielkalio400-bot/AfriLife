using System;
using AfriLife.NPC.Scheduling;

namespace AfriLife.NPC
{
    [Serializable]
    public sealed class NpcRuntimeState
    {
        public NpcProfile Profile = new();
        public NpcDailySchedule Schedule = new();
        public string CurrentLocationId = string.Empty;
        public string CurrentVehicleId = string.Empty;
        public NpcScheduleActivity CurrentActivity = NpcScheduleActivity.Home;
        public long CashMinorUnits;
        public bool Sleeping;
        public bool AtWork;
    }
}
