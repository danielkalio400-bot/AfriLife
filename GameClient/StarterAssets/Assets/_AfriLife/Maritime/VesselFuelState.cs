using System;

namespace AfriLife.Maritime
{
    [Serializable]
    public sealed class VesselFuelState
    {
        public string VesselId = string.Empty;
        public double FuelLevel01 = 1d;
        public string FuelCategory = "marine-fuel";
        public long UpdatedAtUnixSeconds;
    }
}
