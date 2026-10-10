using System;
using System.Collections.Generic;

namespace AfriLife.NPC.Scheduling
{
    [Serializable]
    public sealed class NpcDailySchedule
    {
        public string NpcId = string.Empty;
        public List<NpcScheduleEntry> Entries = new();
    }
}
