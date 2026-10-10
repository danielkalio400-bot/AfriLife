using System;

namespace AfriLife.Infrastructure.Energy
{
    [Serializable]
    public sealed class GeneratorRuntimeState
    {
        public string GeneratorId = string.Empty;
        public double FuelLiters;
        public double FuelCapacityLiters = 20d;
        public float Condition01 = 1f;
        public bool Running;
        public double RuntimeHours;
        public double FuelUseLitersPerHour = 1.2d;

        public void Normalize()
        {
            FuelCapacityLiters = Math.Max(0d, FuelCapacityLiters);
            FuelLiters = Math.Clamp(FuelLiters, 0d, FuelCapacityLiters);
            Condition01 = Math.Clamp(Condition01, 0f, 1f);
            RuntimeHours = Math.Max(0d, RuntimeHours);
            FuelUseLitersPerHour = Math.Max(0d, FuelUseLitersPerHour);
            if (Condition01 <= 0f || FuelLiters <= 0d) Running = false;
        }
    }
}
