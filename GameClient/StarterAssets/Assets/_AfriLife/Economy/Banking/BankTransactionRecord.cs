using System;
using AfriLife.Economy.Money;

namespace AfriLife.Economy.Banking
{
    [Serializable]
    public sealed class BankTransactionRecord
    {
        public string TransactionId = string.Empty;
        public string FromAccountId = string.Empty;
        public string ToAccountId = string.Empty;
        public CurrencyCode Currency = CurrencyCode.NGN;
        public long AmountMinorUnits;
        public string Memo = string.Empty;
        public long CreatedAtUnixSeconds;
    }
}
