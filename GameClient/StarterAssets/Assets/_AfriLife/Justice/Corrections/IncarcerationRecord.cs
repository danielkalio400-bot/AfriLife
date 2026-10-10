using System;

namespace AfriLife.Justice.Corrections
{
    [Serializable]
    public sealed class IncarcerationRecord
    {
        public string RecordId = string.Empty;
        public string PersonEntityId = string.Empty;
        public string CourtDecisionId = string.Empty;
        public string FacilityId = string.Empty;
        public string CellId = string.Empty;
        public IncarcerationState State = IncarcerationState.Intake;
        public int SentenceDays;
        public int DaysServed;
        public long StartedAtUnixSeconds;
        public long UpdatedAtUnixSeconds;

        public int RemainingDays => Math.Max(0, SentenceDays - DaysServed);
    }
}
