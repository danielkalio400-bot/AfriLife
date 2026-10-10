using System;

namespace AfriLife.Health
{
    [Serializable]
    public sealed class HospitalPowerBackupState
    {
        public string FacilityId = string.Empty;
        public float GridAvailability01 = 1f;
        public float BackupAvailability01 = 1f;
        public bool CriticalLoadsProtected = true;

        public float EffectiveAvailability01
        {
            get
            {
                GridAvailability01 = Math.Clamp(GridAvailability01, 0f, 1f);
                BackupAvailability01 = Math.Clamp(BackupAvailability01, 0f, 1f);
                return Math.Max(GridAvailability01, BackupAvailability01);
            }
        }
    }
}
