using System;

namespace AfriLife.Health
{
    [Serializable]
    public sealed class PatientVisitState
    {
        public string VisitId = string.Empty;
        public string PatientEntityId = string.Empty;
        public string FacilityId = string.Empty;
        public CarePathType CarePath;
        public IncidentSeverity Priority = IncidentSeverity.Minor;
        public string Status = "waiting";
        public long ArrivedAtUnixSeconds;
        public long UpdatedAtUnixSeconds;
    }
}
