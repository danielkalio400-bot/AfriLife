using System;

namespace AfriLife.Infrastructure.Power
{
    public sealed class PowerRestorationService
    {
        public void Advance(PowerRestorationTask task, double gameHours)
        {
            if (task == null || gameHours <= 0d || task.Complete) return;
            task.Normalize();

            float crewFactor = Math.Max(0.25f, task.AssignedCrewCount);
            float difficulty = 0.5f + task.Severity01;
            float priority = task.CriticalInfrastructurePriority ? 1.25f : 1f;
            float progress = (float)(gameHours * 0.08d * crewFactor * priority / difficulty);

            task.Progress01 = Math.Clamp(task.Progress01 + progress, 0f, 1f);
        }

        public void ApplyCompletion(PowerRestorationTask task, RegionalPowerState state)
        {
            if (task == null || state == null || !task.Complete || task.RegionId != state.RegionId) return;
            state.MajorFault = false;
            state.DistributionCondition01 = Math.Clamp(state.DistributionCondition01 + 0.35f, 0f, 1f);
        }
    }
}
