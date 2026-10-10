using System;

namespace AfriLife.Phone
{
    [Serializable]
    public sealed class MobilePhoneState
    {
        public string DeviceId = string.Empty;
        public string ProviderId = string.Empty;
        public string PhoneNumber = string.Empty;
        public long RemainingDataMegabytes;
        public long DataExpiryUnixSeconds;

        public bool HasUsableData(long nowUnixSeconds) =>
            RemainingDataMegabytes > 0 && nowUnixSeconds < DataExpiryUnixSeconds;
    }
}
