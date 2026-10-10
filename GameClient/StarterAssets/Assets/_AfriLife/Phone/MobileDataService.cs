using System;
using AfriLife.Economy.Money;

namespace AfriLife.Phone
{
    public sealed class MobileDataService
    {
        public bool TryBuy(
            MobileDataPlan plan,
            MobilePhoneState phone,
            WalletState wallet,
            DateTimeOffset now)
        {
            if (plan == null || phone == null || wallet == null ||
                plan.PriceMinorUnits < 0 || plan.DataMegabytes <= 0)
                return false;

            if (!wallet.TryDebit(new MoneyAmount(plan.Currency, plan.PriceMinorUnits)))
                return false;

            phone.ProviderId = plan.ProviderId;
            phone.RemainingDataMegabytes += plan.DataMegabytes;
            phone.DataExpiryUnixSeconds = now.AddDays(Math.Max(1, plan.ValidDays)).ToUnixTimeSeconds();
            return true;
        }

        public bool TryConsume(MobilePhoneState phone, long megabytes, long nowUnixSeconds)
        {
            if (phone == null || megabytes <= 0 || !phone.HasUsableData(nowUnixSeconds))
                return false;

            if (phone.RemainingDataMegabytes < megabytes) return false;
            phone.RemainingDataMegabytes -= megabytes;
            return true;
        }
    }
}
