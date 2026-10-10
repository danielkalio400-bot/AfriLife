using System;

namespace AfriLife.Infrastructure.Utilities
{
    [Serializable]
    public sealed class UtilityServiceState
    {
        public UtilityDependencyType Type;
        public float Availability01 = 1f;
        public bool BackupAvailable;
        public float BackupAvailability01;
        public string LastEventId = string.Empty;

        public void Normalize()
        {
            Availability01 = Math.Clamp(Availability01, 0f, 1f);
            BackupAvailability01 = Math.Clamp(BackupAvailability01, 0f, 1f);
        }

        public float EffectiveAvailability01()
        {
            Normalize();
            return BackupAvailable
                ? Math.Max(Availability01, BackupAvailability01)
                : Availability01;
        }
    }
}
