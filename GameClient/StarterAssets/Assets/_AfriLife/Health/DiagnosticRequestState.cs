using System;

namespace AfriLife.Health
{
    [Serializable]
    public sealed class DiagnosticRequestState
    {
        public string RequestId = string.Empty;
        public string VisitId = string.Empty;
        public string FacilityId = string.Empty;
        public DiagnosticServiceType Type;
        public string Status = "ordered";
        public int QueuePosition;
        public long OrderedAtUnixSeconds;
        public long CompletedAtUnixSeconds;
    }
}
