using System;
using AfriLife.Economy.Money;

namespace AfriLife.Marketplace
{
    [Serializable]
    public sealed class MarketplaceOrder
    {
        public string OrderId = string.Empty;
        public string BuyerEntityId = string.Empty;
        public string SellerId = string.Empty;
        public CurrencyCode Currency = CurrencyCode.NGN;
        public long TotalMinorUnits;
        public MarketplaceOrderState State = MarketplaceOrderState.PendingPayment;
        public string DeliveryId = string.Empty;
        public long CreatedAtUnixSeconds;
        public long UpdatedAtUnixSeconds;
    }
}
