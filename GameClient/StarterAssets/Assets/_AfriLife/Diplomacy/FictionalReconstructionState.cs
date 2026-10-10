using System;

namespace AfriLife.Diplomacy
{
    [Serializable]
    public sealed class FictionalReconstructionState
    {
        public string reconstructionId = string.Empty;
        public string countryId = string.Empty;
        public string regionId = string.Empty;
        public string governmentProjectId = string.Empty;
        public string governmentSpendingId = string.Empty;
        public string currency = string.Empty;
        public long amountMinorUnits;
        public string recordedAt = string.Empty;
    }
}
