using System;

namespace AfriLife.Justice.Corrections
{
    [Serializable]
    public sealed class CorrectionalFacilityState
    {
        public string FacilityId = string.Empty;
        public string CountryId = string.Empty;
        public string RegionId = string.Empty;
        public int Capacity;
        public int Occupancy;
        public bool Open = true;

        public void Normalize()
        {
            Capacity = Math.Max(0, Capacity);
            Occupancy = Math.Clamp(Occupancy, 0, Capacity);
        }
    }
}
