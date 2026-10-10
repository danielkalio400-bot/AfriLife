using System;

namespace AfriLife.Infrastructure.Telecom
{
    [Serializable]
    public sealed class RegionalTelecomState
    {
        public string RegionId = string.Empty;
        public CoverageTier Coverage = CoverageTier.Good;
        public float Congestion01;
        public float GridAvailability01 = 1f;
        public float BackupEnergy01 = 1f;
        public bool FiberBackhaulAvailable = true;
        public bool RoamingEnabled;

        public void Normalize()
        {
            Congestion01 = Math.Clamp(Congestion01, 0f, 1f);
            GridAvailability01 = Math.Clamp(GridAvailability01, 0f, 1f);
            BackupEnergy01 = Math.Clamp(BackupEnergy01, 0f, 1f);
        }

        public float EffectiveService01()
        {
            Normalize();
            float coverage = (float)Coverage / (float)CoverageTier.Strong;
            float power = Math.Max(GridAvailability01, BackupEnergy01);
            return Math.Clamp(coverage * power * (1f - Congestion01 * 0.65f), 0f, 1f);
        }
    }
}
