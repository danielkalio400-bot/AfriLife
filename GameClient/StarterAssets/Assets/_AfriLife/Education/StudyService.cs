using System;

namespace AfriLife.Education
{
    public sealed class StudyService
    {
        public bool Study(EducationState state, float progressDelta)
        {
            if (state == null || progressDelta <= 0f) return false;
            state.StudyProgress = Math.Clamp(state.StudyProgress + progressDelta, 0f, 1f);
            return true;
        }
    }
}
