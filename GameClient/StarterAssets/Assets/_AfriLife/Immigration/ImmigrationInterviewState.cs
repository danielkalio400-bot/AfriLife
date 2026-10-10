using System;

namespace AfriLife.Immigration
{
    [Serializable]
    public sealed class ImmigrationInterviewState
    {
        public string InterviewId = string.Empty;
        public string ApplicationId = string.Empty;
        public string OfficerEntityId = string.Empty;
        public long ScheduledAtUnixSeconds;
        public string Status = "scheduled";
        public string OutcomeTag = string.Empty;
    }
}
