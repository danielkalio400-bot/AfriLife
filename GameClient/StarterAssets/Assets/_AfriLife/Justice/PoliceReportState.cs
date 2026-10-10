using System;

namespace AfriLife.Justice
{
    [Serializable]
    public sealed class PoliceReportState
    {
        public string ReportId = string.Empty;
        public string IncidentId = string.Empty;
        public string ReportingEntityId = string.Empty;
        public string StationId = string.Empty;
        public string Status = "filed";
        public long FiledAtUnixSeconds;
    }
}
