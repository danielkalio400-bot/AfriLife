using System;

namespace AfriLife.Justice.Corrections
{
    [Serializable]
    public sealed class ParoleReviewRecord
    {
        public string ReviewId = string.Empty;
        public string RecordId = string.Empty;
        public ParoleReviewState State = ParoleReviewState.NotEligible;
        public int MinimumDaysRequired;
        public long ReviewedAtUnixSeconds;
        public string OutcomeTag = string.Empty;
    }
}
