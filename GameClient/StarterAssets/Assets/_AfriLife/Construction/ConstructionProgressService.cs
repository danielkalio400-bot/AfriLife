using System;
using System.Linq;

namespace AfriLife.Construction
{
    public sealed class ConstructionProgressService
    {
        public bool Advance(ConstructionProjectState project, double gameHours)
        {
            if (project == null || gameHours <= 0d || project.Phase == ConstructionPhase.Completed)
                return false;

            project.Normalize();
            if (project.Materials.Any(material => material != null && !material.Fulfilled))
                return false;

            var activeWorkers = project.Workers.Where(worker => worker != null && worker.Active).ToArray();
            if (activeWorkers.Length == 0) return false;

            double skill = activeWorkers.Average(worker =>
            {
                worker.Normalize();
                return Math.Max(0.1f, worker.Skill01);
            });

            project.PhaseProgress01 = Math.Clamp(
                project.PhaseProgress01 + (float)(gameHours * 0.02d * skill * Math.Sqrt(activeWorkers.Length)),
                0f,
                1f);

            if (project.PhaseProgress01 < 1f) return true;

            project.PhaseProgress01 = 0f;
            project.Phase = project.Phase == ConstructionPhase.Inspection
                ? ConstructionPhase.Completed
                : project.Phase + 1;
            return true;
        }
    }
}
