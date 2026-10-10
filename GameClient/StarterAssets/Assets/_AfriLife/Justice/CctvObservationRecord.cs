using System;

namespace AfriLife.Justice
{
    [Serializable]
    public sealed class CctvObservationRecord
    {
        public string ObservationId = string.Empty;
        public string IncidentId = string.Empty;
        public string CameraId = string.Empty;
        public string LocationTag = string.Empty;
        public string ObservationTag = string.Empty;
        public long CapturedAtUnixSeconds;
        public bool PreservedForReview;
    }
}
