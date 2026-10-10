using System;

namespace AfriLife.Justice
{
    [Serializable]
    public sealed class RecoveryRecord
    {
        public string RecoveryId = string.Empty;
        public string IncidentId = string.Empty;
        public string ItemRecordId = string.Empty;
        public string RecoverySource = string.Empty;
        public long RecoveredAtUnixSeconds;
        public bool ReturnedToOwner;
    }
}
