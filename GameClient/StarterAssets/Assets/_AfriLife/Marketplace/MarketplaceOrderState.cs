namespace AfriLife.Marketplace
{
    public enum MarketplaceOrderState
    {
        PendingPayment = 0,
        Paid = 1,
        Preparing = 2,
        InTransit = 3,
        Delivered = 4,
        ReturnRequested = 5,
        Refunded = 6,
        Cancelled = 7,
        Disputed = 8
    }
}
