using System;
using System.Collections.Generic;

namespace AfriLife.Economy.Money
{
    [Serializable]
    public sealed class WalletState
    {
        public List<CurrencyBalance> Balances = new();

        public long GetMinorUnits(CurrencyCode currency)
        {
            return Balances.Find(balance => balance.Currency == currency)?.MinorUnits ?? 0L;
        }

        public void Credit(MoneyAmount amount)
        {
            if (amount.MinorUnits < 0) throw new ArgumentOutOfRangeException(nameof(amount));
            var balance = GetOrCreate(amount.Currency);
            checked { balance.MinorUnits += amount.MinorUnits; }
        }

        public bool TryDebit(MoneyAmount amount)
        {
            if (amount.MinorUnits < 0) return false;
            var balance = GetOrCreate(amount.Currency);
            if (balance.MinorUnits < amount.MinorUnits) return false;
            balance.MinorUnits -= amount.MinorUnits;
            return true;
        }

        private CurrencyBalance GetOrCreate(CurrencyCode currency)
        {
            var balance = Balances.Find(item => item.Currency == currency);
            if (balance != null) return balance;

            balance = new CurrencyBalance { Currency = currency, MinorUnits = 0L };
            Balances.Add(balance);
            return balance;
        }
    }
}
