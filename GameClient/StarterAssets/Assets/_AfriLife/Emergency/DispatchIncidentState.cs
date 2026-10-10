using System;
using System.Collections.Generic;

namespace AfriLife.Emergency
{
    [Serializable]
    public sealed class DispatchIncidentState
    {
        public string IncidentId = string.Empty;
        public string CallId = string.Empty;
        public string RegionId = string.Empty;
        public EmergencyIncidentType Type;
        public EmergencyPriority Priority = EmergencyPriority.Normal;
        public string Status = "open";
        public List<string> AssignedUnitIds = new();
        public bool TrafficDiversionRequested;
        public bool HospitalTransportRequested;
        public string DestinationFacilityId = string.Empty;
        public long OpenedAtUnixSeconds;
        public long ResolvedAtUnixSeconds;
    }
}
