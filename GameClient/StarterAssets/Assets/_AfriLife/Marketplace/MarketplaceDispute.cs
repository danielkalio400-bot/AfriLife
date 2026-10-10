using System;

namespace AfriLife.Marketplace
{
    [Serializable]
    public sealed class MarketplaceDispute
    {
        public string DisputeId = string.Empty;
        public string OrderId = string.Empty;
        public string BuyerEntityId = string.Empty;
        public string SellerId = string.Empty;
        public string ReasonCode = string.Empty;
        public MarketplaceDisputeState State = MarketplaceDisputeState.Open;
        public long OpenedAtUnixSeconds;
    }
}
