using System;

namespace AfriLife.Justice.Corrections
{
    [Serializable]
    public sealed class CorrectionalVisitRecord
    {
        public string VisitId = string.Empty;
        public string RecordId = string.Empty;
        public string VisitorEntityId = string.Empty;
        public CorrectionalVisitType VisitType;
        public long ScheduledAtUnixSeconds;
        public int DurationMinutes = 30;
        public string Status = "scheduled";
    }
}
