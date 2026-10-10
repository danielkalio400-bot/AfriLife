using System;

namespace AfriLife.Justice
{
    [Serializable]
    public sealed class StolenItemRecord
    {
        public string ItemRecordId = string.Empty;
        public string OwnerEntityId = string.Empty;
        public string Category = string.Empty;
        public string DescriptionTag = string.Empty;
        public string SerialOrRegistrationTag = string.Empty;
        public bool Recovered;
        public long RecoveredAtUnixSeconds;
    }
}
