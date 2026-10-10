using System;

namespace AfriLife.Justice
{
    [Serializable]
    public sealed class WitnessRecord
    {
        public string WitnessRecordId = string.Empty;
        public string IncidentId = string.Empty;
        public string WitnessEntityId = string.Empty;
        public string StatementTag = string.Empty;
        public long RecordedAtUnixSeconds;
        public bool AvailableForFollowUp = true;
    }
}
