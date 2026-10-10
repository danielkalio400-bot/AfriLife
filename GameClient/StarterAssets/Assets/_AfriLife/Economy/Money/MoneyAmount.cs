using System;

namespace AfriLife.Economy.Money
{
    [Serializable]
    public readonly struct MoneyAmount
    {
        public CurrencyCode Currency { get; }
        public long MinorUnits { get; }

        public MoneyAmount(CurrencyCode currency, long minorUnits)
        {
            Currency = currency;
            MinorUnits = minorUnits;
        }

        public MoneyAmount Add(MoneyAmount other)
        {
            EnsureSameCurrency(other);
            checked { return new MoneyAmount(Currency, MinorUnits + other.MinorUnits); }
        }

        public MoneyAmount Subtract(MoneyAmount other)
        {
            EnsureSameCurrency(other);
            checked { return new MoneyAmount(Currency, MinorUnits - other.MinorUnits); }
        }

        private void EnsureSameCurrency(MoneyAmount other)
        {
            if (Currency != other.Currency)
                throw new InvalidOperationException("Currency mismatch.");
        }
    }
}
