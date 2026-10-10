using System;

namespace AfriLife.Transport.Roads
{
    [Serializable]
    public sealed class ParkingZoneState
    {
        public string ParkingZoneId = string.Empty;
        public string DistrictId = string.Empty;
        public int Capacity;
        public int OccupiedSpaces;
        public long FeeMinorUnits;
        public string CurrencyCode = string.Empty;

        public void Normalize()
        {
            Capacity = Math.Max(0, Capacity);
            OccupiedSpaces = Math.Clamp(OccupiedSpaces, 0, Capacity);
            FeeMinorUnits = Math.Max(0L, FeeMinorUnits);
        }

        public bool HasSpace => OccupiedSpaces < Capacity;
    }
}
