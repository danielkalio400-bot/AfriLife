using System;
using System.Collections.Generic;

namespace AfriLife.Education
{
    [Serializable]
    public sealed class EducationState
    {
        public List<QualificationRecord> Qualifications = new();
        public string CurrentProgramId = string.Empty;
        public float StudyProgress;

        public void Normalize()
        {
            StudyProgress = Math.Clamp(StudyProgress, 0f, 1f);
            foreach (var qualification in Qualifications)
            {
                if (qualification != null)
                    qualification.Progress01 = Math.Clamp(qualification.Progress01, 0f, 1f);
            }
        }
    }
}
