using System;

namespace AfriLife.RealEstate
{
    [Serializable]
    public sealed class RentPaymentState
    {
        public string PaymentId = string.Empty;
        public string AgreementId = string.Empty;
        public long AmountMinorUnits;
        public long DueAtUnixSeconds;
        public long PaidAtUnixSeconds;
        public bool Paid;
    }
}
