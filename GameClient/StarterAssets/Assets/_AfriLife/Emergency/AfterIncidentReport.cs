using System;

namespace AfriLife.Emergency
{
    [Serializable]
    public sealed class AfterIncidentReport
    {
        public string ReportId = string.Empty;
        public string IncidentId = string.Empty;
        public string OutcomeCode = string.Empty;
        public int UnitsDispatched;
        public long OpenedAtUnixSeconds;
        public long ResolvedAtUnixSeconds;
        public bool HospitalTransportUsed;
        public bool TrafficDiversionUsed;
        public bool TowServiceUsed;
    }
}
