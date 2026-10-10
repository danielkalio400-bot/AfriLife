using System;

namespace AfriLife.Aviation
{
    [Serializable]
    public sealed class AirCargoRecord
    {
        public string CargoId = string.Empty;
        public string FlightId = string.Empty;
        public string CategoryTag = string.Empty;
        public double WeightKilograms;
        public string Status = "booked";
    }
}
