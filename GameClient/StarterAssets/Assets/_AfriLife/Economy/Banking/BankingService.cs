using System;
using System.Collections.Generic;
using AfriLife.Economy.Money;

namespace AfriLife.Economy.Banking
{
    public sealed class BankingService
    {
        private readonly Dictionary<string, BankAccountState> _accounts = new();
        private readonly List<BankTransactionRecord> _transactions = new();

        public IReadOnlyCollection<BankAccountState> Accounts => _accounts.Values;
        public IReadOnlyList<BankTransactionRecord> Transactions => _transactions;

        public bool Register(BankAccountState account)
        {
            if (account == null || string.IsNullOrWhiteSpace(account.AccountId)) return false;
            if (_accounts.ContainsKey(account.AccountId)) return false;
            account.BalanceMinorUnits = Math.Max(0L, account.BalanceMinorUnits);
            _accounts.Add(account.AccountId, account);
            return true;
        }

        public bool Deposit(string accountId, MoneyAmount amount)
        {
            if (!_accounts.TryGetValue(accountId, out var account) ||
                account.Frozen || account.Currency != amount.Currency ||
                amount.MinorUnits <= 0)
                return false;

            checked { account.BalanceMinorUnits += amount.MinorUnits; }
            return true;
        }

        public bool Transfer(
            string fromAccountId,
            string toAccountId,
            MoneyAmount amount,
            string memo = "")
        {
            if (!_accounts.TryGetValue(fromAccountId, out var from) ||
                !_accounts.TryGetValue(toAccountId, out var to) ||
                from.Frozen || to.Frozen ||
                from.Currency != amount.Currency ||
                to.Currency != amount.Currency ||
                amount.MinorUnits <= 0 ||
                from.BalanceMinorUnits < amount.MinorUnits)
                return false;

            from.BalanceMinorUnits -= amount.MinorUnits;
            checked { to.BalanceMinorUnits += amount.MinorUnits; }

            _transactions.Add(new BankTransactionRecord
            {
                TransactionId = Guid.NewGuid().ToString("N"),
                FromAccountId = fromAccountId,
                ToAccountId = toAccountId,
                Currency = amount.Currency,
                AmountMinorUnits = amount.MinorUnits,
                Memo = memo ?? string.Empty,
                CreatedAtUnixSeconds = DateTimeOffset.UtcNow.ToUnixTimeSeconds()
            });
            return true;
        }
    }
}
