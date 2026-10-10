using System;

namespace AfriLife.Education
{
    [Serializable]
    public sealed class QualificationRecord
    {
        public string QualificationId = string.Empty;
        public string InstitutionId = string.Empty;
        public QualificationType Type;
        public string Subject = string.Empty;
        public bool Completed;
        public float Progress01;
    }
}
