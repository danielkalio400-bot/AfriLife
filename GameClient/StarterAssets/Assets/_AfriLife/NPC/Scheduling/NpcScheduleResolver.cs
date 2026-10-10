namespace AfriLife.NPC.Scheduling
{
    public sealed class NpcScheduleResolver
    {
        public NpcScheduleEntry Resolve(NpcDailySchedule schedule, int minuteOfDay)
        {
            if (schedule?.Entries == null) return null;

            foreach (var entry in schedule.Entries)
            {
                if (entry != null && entry.Contains(minuteOfDay))
                    return entry;
            }

            return null;
        }
    }
}
