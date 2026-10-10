using AfriLife.Economy.Money;

namespace AfriLife.Housing.Bills
{
    public sealed class BillPaymentService
    {
        public bool TryPay(BillState bill, WalletState wallet)
        {
            if (bill == null || wallet == null || bill.Paid || bill.AmountMinorUnits < 0)
                return false;

            if (!wallet.TryDebit(new MoneyAmount(bill.Currency, bill.AmountMinorUnits)))
                return false;

            bill.Paid = true;
            return true;
        }
    }
}
