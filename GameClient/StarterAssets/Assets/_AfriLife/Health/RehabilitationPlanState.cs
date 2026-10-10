using System;

namespace AfriLife.Health
{
    [Serializable]
    public sealed class RehabilitationPlanState
    {
        public string PlanId = string.Empty;
        public string PatientEntityId = string.Empty;
        public string FacilityId = string.Empty;
        public int PlannedSessions;
        public int CompletedSessions;
        public bool Active = true;

        public void Normalize()
        {
            PlannedSessions = Math.Max(0, PlannedSessions);
            CompletedSessions = Math.Clamp(CompletedSessions, 0, PlannedSessions);
            if (PlannedSessions > 0 && CompletedSessions >= PlannedSessions)
                Active = false;
        }
    }
}
