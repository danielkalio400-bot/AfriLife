using System;

namespace AfriLife.Justice
{
    [Serializable]
    public sealed class PropertyIncidentState
    {
        public string IncidentId = string.Empty;
        public string OwnerEntityId = string.Empty;
        public string RegionId = string.Empty;
        public PropertyIncidentType Type;
        public string ItemRecordId = string.Empty;
        public string Status = "reported";
        public long ReportedAtUnixSeconds;
        public bool Recovered;
    }
}
