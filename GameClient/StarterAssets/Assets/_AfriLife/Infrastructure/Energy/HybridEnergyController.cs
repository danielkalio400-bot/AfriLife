using System;

namespace AfriLife.Infrastructure.Energy
{
    public sealed class HybridEnergyController
    {
        public BackupEnergySourceType Select(
            float gridAvailability01,
            SolarArrayState solar,
            BatteryStorageState battery,
            GeneratorRuntimeState generator,
            double requiredKw)
        {
            float grid = Math.Clamp(gridAvailability01, 0f, 1f);
            solar?.RecalculateOutput();
            battery?.Normalize();
            generator?.Normalize();

            if (grid >= 0.85f) return BackupEnergySourceType.None;

            double solarOutput = solar?.CurrentOutputKilowatts ?? 0d;
            bool batteryReady = battery != null && battery.StoredKwh > 0.1d && battery.MaximumDischargeKw > 0d;
            bool generatorReady = generator != null && generator.Condition01 > 0.15f && generator.FuelLiters > 0.1d;

            if (solarOutput >= Math.Max(0d, requiredKw))
                return BackupEnergySourceType.SolarBattery;
            if (solarOutput > 0d && batteryReady)
                return BackupEnergySourceType.Hybrid;
            if (batteryReady)
                return BackupEnergySourceType.GridBattery;
            if (generatorReady)
                return BackupEnergySourceType.Generator;
            return BackupEnergySourceType.None;
        }
    }
}
