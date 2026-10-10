using System;

namespace AfriLife.Justice.Police
{
    [Serializable]
    public sealed class TrafficEnforcementRecord
    {
        public string RecordId = string.Empty;
        public string VehicleId = string.Empty;
        public string DriverEntityId = string.Empty;
        public string RuleTag = string.Empty;
        public string Outcome = "warning";
        public long FineMinorUnits;
        public long RecordedAtUnixSeconds;
    }
}
