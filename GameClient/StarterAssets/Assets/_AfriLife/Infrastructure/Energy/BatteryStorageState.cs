using System;

namespace AfriLife.Infrastructure.Energy
{
    [Serializable]
    public sealed class BatteryStorageState
    {
        public string BatteryId = string.Empty;
        public double CapacityKwh = 10d;
        public double StoredKwh = 5d;
        public float Health01 = 1f;
        public double MaximumChargeKw = 3d;
        public double MaximumDischargeKw = 3d;

        public void Normalize()
        {
            CapacityKwh = Math.Max(0d, CapacityKwh);
            Health01 = Math.Clamp(Health01, 0f, 1f);
            StoredKwh = Math.Clamp(StoredKwh, 0d, CapacityKwh * Health01);
            MaximumChargeKw = Math.Max(0d, MaximumChargeKw);
            MaximumDischargeKw = Math.Max(0d, MaximumDischargeKw);
        }
    }
}
