using System;
using AfriLife.Economy.Money;

namespace AfriLife.Economy.Banking
{
    [Serializable]
    public sealed class BankAccountState
    {
        public string AccountId = string.Empty;
        public string OwnerEntityId = string.Empty;
        public string BankId = string.Empty;
        public AccountType Type;
        public CurrencyCode Currency = CurrencyCode.NGN;
        public long BalanceMinorUnits;
        public bool Frozen;
        public long OpenedAtUnixSeconds;
    }
}
