using System;

namespace AfriLife.Justice.Corrections
{
    [Serializable]
    public sealed class ReintegrationPlanState
    {
        public string PlanId = string.Empty;
        public string PersonEntityId = string.Empty;
        public bool HousingSupport;
        public bool EmploymentSupport;
        public bool EducationSupport;
        public bool HealthFollowUp;
        public bool FamilySupport;
        public string Status = "planned";
    }
}
