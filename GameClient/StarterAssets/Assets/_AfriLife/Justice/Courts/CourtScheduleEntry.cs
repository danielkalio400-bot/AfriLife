using System;

namespace AfriLife.Justice.Courts
{
    [Serializable]
    public sealed class CourtScheduleEntry
    {
        public string ScheduleId = string.Empty;
        public string CaseId = string.Empty;
        public string CourtroomId = string.Empty;
        public long StartsAtUnixSeconds;
        public int DurationMinutes = 60;
        public bool Completed;

        public void Normalize()
        {
            DurationMinutes = Math.Clamp(DurationMinutes, 15, 480);
        }
    }
}
