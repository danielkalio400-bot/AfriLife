using System;

namespace AfriLife.Maritime
{
    [Serializable]
    public sealed class MaritimeTradeRecord
    {
        public string TradeRecordId = string.Empty;
        public string VoyageId = string.Empty;
        public string OriginCountryId = string.Empty;
        public string DestinationCountryId = string.Empty;
        public string CargoCategory = string.Empty;
        public double CargoWeightKilograms;
        public long RecordedAtUnixSeconds;
    }
}
