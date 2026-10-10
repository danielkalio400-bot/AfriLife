using System;
using AfriLife.Economy.Money;

namespace AfriLife.Maritime
{
    [Serializable]
    public sealed class PortFeeRecord
    {
        public string FeeId = string.Empty;
        public string PortId = string.Empty;
        public string VoyageId = string.Empty;
        public CurrencyCode Currency = CurrencyCode.NGN;
        public long AmountMinorUnits;
        public string FeeType = "port-service";
        public bool Paid;
    }
}
