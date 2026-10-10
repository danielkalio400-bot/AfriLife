using System;

namespace AfriLife.Emergency
{
    [Serializable]
    public sealed class EmergencyCallState
    {
        public string CallId = string.Empty;
        public string CallerEntityId = string.Empty;
        public string RegionId = string.Empty;
        public string LocationTag = string.Empty;
        public EmergencyIncidentType IncidentType;
        public EmergencyPriority Priority = EmergencyPriority.Normal;
        public string Status = "received";
        public long ReceivedAtUnixSeconds;
    }
}
