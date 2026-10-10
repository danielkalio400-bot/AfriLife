using System;

namespace AfriLife.Phone
{
    [Serializable]
    public sealed class TelecomAccountState
    {
        public string AccountId = string.Empty;
        public string ProviderId = string.Empty;
        public string CountryId = string.Empty;
        public long AirtimeMinorUnits;
        public long DataMegabytes;
        public long DataExpiryUnixSeconds;
        public bool RoamingEnabled;
    }
}
