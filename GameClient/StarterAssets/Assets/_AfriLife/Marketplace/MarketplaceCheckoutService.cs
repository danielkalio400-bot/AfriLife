using System;
using System.Collections.Generic;
using AfriLife.Economy.Money;

namespace AfriLife.Marketplace
{
    public sealed class MarketplaceCheckoutService
    {
        public bool TryCheckout(
            MarketplaceListing listing,
            int quantity,
            WalletState wallet,
            string buyerEntityId,
            out MarketplaceOrder order)
        {
            order = null;
            if (listing == null || wallet == null || quantity <= 0) return false;
            listing.Normalize();
            if (!listing.Active || listing.AvailableQuantity < quantity) return false;

            long total = checked(listing.UnitPriceMinorUnits * quantity);
            if (!wallet.TryDebit(new MoneyAmount(listing.Currency, total)))
                return false;

            listing.AvailableQuantity -= quantity;
            listing.Normalize();

            long now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            order = new MarketplaceOrder
            {
                OrderId = Guid.NewGuid().ToString("N"),
                BuyerEntityId = buyerEntityId ?? string.Empty,
                SellerId = listing.SellerId,
                Currency = listing.Currency,
                TotalMinorUnits = total,
                State = MarketplaceOrderState.Paid,
                CreatedAtUnixSeconds = now,
                UpdatedAtUnixSeconds = now
            };
            return true;
        }
    }
}
