using System;

namespace AfriLife.Immigration
{
    [Serializable]
    public sealed class PassportRecord
    {
        public string PassportRecordId = string.Empty;
        public string PersonEntityId = string.Empty;
        public string IssuingCountryId = string.Empty;
        public PassportState State = PassportState.Application;
        public long AppliedAtUnixSeconds;
        public long IssuedAtUnixSeconds;
        public long ExpiresAtUnixSeconds;
    }
}
