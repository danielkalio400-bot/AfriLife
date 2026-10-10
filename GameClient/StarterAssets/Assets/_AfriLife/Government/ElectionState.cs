using System;

namespace AfriLife.Government
{
    [Serializable]
    public sealed class ElectionState
    {
        public string ElectionId = string.Empty;
        public string CountryId = string.Empty;
        public string OfficeTag = string.Empty;
        public string Status = "scheduled";
        public long ScheduledAtUnixSeconds;
        public string WinnerCandidateId = string.Empty;
        public int TotalVotesRecorded;
    }
}
