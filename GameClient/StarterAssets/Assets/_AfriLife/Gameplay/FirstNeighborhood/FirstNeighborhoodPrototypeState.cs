using System;

namespace AfriLife.Gameplay.FirstNeighborhood
{
    // Saved inside WorldSaveData. This is an original scripted prototype,
    // not certified day-to-day free roaming or a production economy.
    [Serializable]
    public sealed class FirstNeighborhoodPrototypeState
    {
        public string ScenarioId = "lagos-first-district-prototype";
        public string CurrentLocation = "home";
        public int NextStep;
        public int DaysCompleted;
        public long ElapsedWorldSeconds;
        public bool Started;
        public string[] CompletedSteps = Array.Empty<string>();

        public void Normalize(int stepsCount)
        {
            NextStep = Math.Max(0, Math.Min(stepsCount, NextStep));
            DaysCompleted = Math.Max(0, DaysCompleted);
            ElapsedWorldSeconds = Math.Max(0, ElapsedWorldSeconds);
            CompletedSteps ??= Array.Empty<string>();
            if (CompletedSteps.Length > NextStep)
                Array.Resize(ref CompletedSteps, NextStep);
            CurrentLocation ??= "home";
        }
    }
}
