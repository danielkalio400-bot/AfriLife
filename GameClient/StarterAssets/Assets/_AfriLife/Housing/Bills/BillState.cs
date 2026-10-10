using System;
using AfriLife.Economy.Money;

namespace AfriLife.Housing.Bills
{
    [Serializable]
    public sealed class BillState
    {
        public string BillId = string.Empty;
        public BillType Type;
        public CurrencyCode Currency = CurrencyCode.NGN;
        public long AmountMinorUnits;
        public long DueAtUnixSeconds;
        public bool Paid;
    }
}
