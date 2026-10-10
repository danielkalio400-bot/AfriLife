using System;
using AfriLife.Economy.Money;

namespace AfriLife.Infrastructure.Utilities
{
    public sealed class UtilityBillingService
    {
        public UtilityInvoice CreateInvoice(
            string accountId,
            UtilityMeterReading reading,
            UtilityBillingPlan plan,
            long issuedAtUnixSeconds,
            int dueDays = 14)
        {
            if (reading == null) throw new ArgumentNullException(nameof(reading));
            if (plan == null) throw new ArgumentNullException(nameof(plan));
            if (reading.Utility != plan.Utility)
                throw new InvalidOperationException("Utility type mismatch.");

            double billableUnits = Math.Max(0d, reading.Consumption - Math.Max(0d, plan.IncludedUnits));
            long usageCharge = checked((long)Math.Round(billableUnits * Math.Max(0L, plan.UnitRateMinorUnits)));

            return new UtilityInvoice
            {
                InvoiceId = Guid.NewGuid().ToString("N"),
                AccountId = accountId ?? string.Empty,
                Utility = plan.Utility,
                Currency = plan.Currency,
                AmountMinorUnits = checked(Math.Max(0L, plan.FixedChargeMinorUnits) + usageCharge),
                IssuedAtUnixSeconds = issuedAtUnixSeconds,
                DueAtUnixSeconds = DateTimeOffset.FromUnixTimeSeconds(issuedAtUnixSeconds)
                    .AddDays(Math.Max(1, dueDays))
                    .ToUnixTimeSeconds(),
                Paid = false
            };
        }

        public bool TryPay(UtilityInvoice invoice, WalletState wallet)
        {
            if (invoice == null || wallet == null || invoice.Paid) return false;
            if (!wallet.TryDebit(new MoneyAmount(invoice.Currency, invoice.AmountMinorUnits)))
                return false;
            invoice.Paid = true;
            return true;
        }
    }
}
