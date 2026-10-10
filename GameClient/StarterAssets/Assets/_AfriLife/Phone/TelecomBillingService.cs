using System;
using AfriLife.Economy.Money;

namespace AfriLife.Phone
{
    public sealed class TelecomBillingService
    {
        public bool TryPurchaseBundle(
            TelecomAccountState account,
            TelecomBundleProduct product,
            WalletState wallet,
            DateTimeOffset now)
        {
            if (account == null || product == null || wallet == null ||
                product.PriceMinorUnits < 0 || product.DataMegabytes <= 0)
                return false;

            if (!wallet.TryDebit(new MoneyAmount(product.Currency, product.PriceMinorUnits)))
                return false;

            account.ProviderId = product.ProviderId;
            account.DataMegabytes += product.DataMegabytes;
            account.DataExpiryUnixSeconds = now.AddDays(Math.Max(1, product.ValidDays)).ToUnixTimeSeconds();
            return true;
        }
    }
}
