using System;

namespace AfriLife.Infrastructure.Power
{
    [Serializable]
    public sealed class PowerRestorationTask
    {
        public string TaskId = string.Empty;
        public string RegionId = string.Empty;
        public string AssetId = string.Empty;
        public float Severity01;
        public float Progress01;
        public int AssignedCrewCount;
        public bool CriticalInfrastructurePriority;

        public void Normalize()
        {
            Severity01 = Math.Clamp(Severity01, 0f, 1f);
            Progress01 = Math.Clamp(Progress01, 0f, 1f);
            AssignedCrewCount = Math.Max(0, AssignedCrewCount);
        }

        public bool Complete => Progress01 >= 1f;
    }
}
