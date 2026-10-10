using System;

namespace AfriLife.Aviation
{
    [Serializable]
    public sealed class BaggageRecord
    {
        public string BaggageId = string.Empty;
        public string FlightId = string.Empty;
        public string PassengerEntityId = string.Empty;
        public double WeightKilograms;
        public string Status = "checked";
    }
}
