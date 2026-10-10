using System;

namespace AfriLife.Maritime
{
    [Serializable]
    public sealed class MaritimeCargoRecord
    {
        public string CargoId = string.Empty;
        public string VoyageId = string.Empty;
        public string CategoryTag = string.Empty;
        public double WeightKilograms;
        public string Status = "booked";
    }
}
