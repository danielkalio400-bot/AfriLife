using AfriLife.Economy.Money;
using AfriLife.Player.Inventory;

namespace AfriLife.Shopping
{
    public sealed class PurchaseService
    {
        public PurchaseResult Buy(ProductDefinition product, WalletState wallet, PlayerInventory inventory)
        {
            if (product == null || wallet == null || inventory == null)
                return new PurchaseResult(false, "shop.invalid_context");

            if (product.PriceMinorUnits < 0 || product.Quantity <= 0 ||
                string.IsNullOrWhiteSpace(product.InventoryItemId))
                return new PurchaseResult(false, "shop.invalid_product");

            var price = new MoneyAmount(product.Currency, product.PriceMinorUnits);
            if (!wallet.TryDebit(price))
                return new PurchaseResult(false, "shop.insufficient_funds");

            if (!inventory.Add(product.InventoryItemId, product.Quantity))
            {
                wallet.Credit(price);
                return new PurchaseResult(false, "shop.inventory_rejected");
            }

            return new PurchaseResult(true, "shop.purchase_complete");
        }
    }
}
