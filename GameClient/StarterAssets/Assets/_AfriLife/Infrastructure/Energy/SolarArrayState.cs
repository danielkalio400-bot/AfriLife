using System;

namespace AfriLife.Infrastructure.Energy
{
    [Serializable]
    public sealed class SolarArrayState
    {
        public string ArrayId = string.Empty;
        public double RatedKilowatts = 3d;
        public float Condition01 = 1f;
        public float SunAvailability01 = 0.8f;
        public double CurrentOutputKilowatts;

        public void RecalculateOutput()
        {
            RatedKilowatts = Math.Max(0d, RatedKilowatts);
            Condition01 = Math.Clamp(Condition01, 0f, 1f);
            SunAvailability01 = Math.Clamp(SunAvailability01, 0f, 1f);
            CurrentOutputKilowatts = RatedKilowatts * Condition01 * SunAvailability01;
        }
    }
}
