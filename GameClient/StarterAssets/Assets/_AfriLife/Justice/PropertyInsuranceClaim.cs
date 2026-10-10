using System;

namespace AfriLife.Justice
{
    [Serializable]
    public sealed class PropertyInsuranceClaim
    {
        public string ClaimId = string.Empty;
        public string IncidentId = string.Empty;
        public string PolicyId = string.Empty;
        public string ClaimantEntityId = string.Empty;
        public long ClaimedAmountMinorUnits;
        public InsuranceClaimState State = InsuranceClaimState.Draft;
        public long SubmittedAtUnixSeconds;
    }
}
