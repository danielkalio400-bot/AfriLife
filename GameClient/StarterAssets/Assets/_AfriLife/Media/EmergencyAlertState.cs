using System;

namespace AfriLife.Media
{
    [Serializable]
    public sealed class EmergencyAlertState
    {
        public string AlertId = string.Empty;
        public string CountryId = string.Empty;
        public string RegionId = string.Empty;
        public string AlertType = string.Empty;
        public string MessageTag = string.Empty;
        public int Severity;
        public bool Active = true;
        public long StartsAtUnixSeconds;
        public long EndsAtUnixSeconds;
    }
}
