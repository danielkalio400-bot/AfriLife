using System;

namespace AfriLife.Immigration
{
    [Serializable]
    public sealed class CitizenshipRecord
    {
        public string RecordId = string.Empty;
        public string PersonEntityId = string.Empty;
        public string CountryId = string.Empty;
        public CitizenshipStatus Status = CitizenshipStatus.Visitor;
        public long EffectiveAtUnixSeconds;
    }
}
