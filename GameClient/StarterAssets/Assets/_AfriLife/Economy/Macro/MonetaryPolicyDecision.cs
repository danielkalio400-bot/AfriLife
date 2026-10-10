using System;

namespace AfriLife.Economy.Macro
{
    [Serializable]
    public sealed class MonetaryPolicyDecision
    {
        public string DecisionId = string.Empty;
        public string CountryId = string.Empty;
        public int PolicyInterestRateBasisPoints;
        public long CurrencySupplyDeltaMinorUnits;
        public string ReasonTag = string.Empty;
        public long RecordedAtUnixSeconds;
    }
}
