using System;

namespace AfriLife.Justice.Corrections
{
    [Serializable]
    public sealed class CorrectionalProgramEnrollment
    {
        public string EnrollmentId = string.Empty;
        public string RecordId = string.Empty;
        public CorrectionalProgramType ProgramType;
        public int PlannedSessions;
        public int CompletedSessions;
        public bool Active = true;

        public void Normalize()
        {
            PlannedSessions = Math.Max(0, PlannedSessions);
            CompletedSessions = Math.Clamp(CompletedSessions, 0, PlannedSessions);
            if (PlannedSessions > 0 && CompletedSessions >= PlannedSessions)
                Active = false;
        }
    }
}
