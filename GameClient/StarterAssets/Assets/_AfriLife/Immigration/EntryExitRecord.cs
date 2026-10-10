using System;

namespace AfriLife.Immigration
{
    [Serializable]
    public sealed class EntryExitRecord
    {
        public string RecordId = string.Empty;
        public string PersonEntityId = string.Empty;
        public string CountryId = string.Empty;
        public string BorderPointId = string.Empty;
        public string Direction = "entry";
        public string TravelDocumentId = string.Empty;
        public string OfficerEntityId = string.Empty;
        public long RecordedAtUnixSeconds;
    }
}
