using System;

namespace AfriLife.Justice
{
    [Serializable]
    public sealed class PropertyInvestigationRecord
    {
        public string InvestigationId = string.Empty;
        public string IncidentId = string.Empty;
        public PropertyInvestigationState State = PropertyInvestigationState.NotOpened;
        public int EvidenceRecordCount;
        public int WitnessRecordCount;
        public bool ItemRecovered;
        public long OpenedAtUnixSeconds;
        public long UpdatedAtUnixSeconds;
    }
}
