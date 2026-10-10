using System;

namespace AfriLife.NPC.Scheduling
{
    [Serializable]
    public sealed class NpcScheduleEntry
    {
        public int StartMinuteOfDay;
        public int EndMinuteOfDay;
        public NpcScheduleActivity Activity;
        public string LocationId = string.Empty;

        public bool Contains(int minuteOfDay)
        {
            int minute = ((minuteOfDay % 1440) + 1440) % 1440;
            int start = ((StartMinuteOfDay % 1440) + 1440) % 1440;
            int end = ((EndMinuteOfDay % 1440) + 1440) % 1440;

            if (start <= end) return minute >= start && minute < end;
            return minute >= start || minute < end;
        }
    }
}
