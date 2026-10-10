using System;

namespace AfriLife.World.Neighborhood
{
    [Serializable]
    public sealed class NeighborhoodServiceRuntimeState
    {
        public string ServiceId = string.Empty;
        public NeighborhoodServiceType Type;
        public bool Open = true;
        public int Capacity;
        public int Occupancy;
        public float UtilityAvailability01 = 1f;
        public float StaffAvailability01 = 1f;

        public void Normalize()
        {
            Capacity = Math.Max(0, Capacity);
            Occupancy = Math.Clamp(Occupancy, 0, Capacity);
            UtilityAvailability01 = Math.Clamp(UtilityAvailability01, 0f, 1f);
            StaffAvailability01 = Math.Clamp(StaffAvailability01, 0f, 1f);
        }

        public float EffectiveCapacity01()
        {
            Normalize();
            if (!Open || Capacity <= 0) return 0f;
            return Math.Clamp(Math.Min(UtilityAvailability01, StaffAvailability01), 0f, 1f);
        }
    }
}
