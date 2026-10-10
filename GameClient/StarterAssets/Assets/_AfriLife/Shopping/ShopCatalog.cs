using System.Collections.Generic;

namespace AfriLife.Shopping
{
    public sealed class ShopCatalog
    {
        private readonly Dictionary<string, ProductDefinition> _products = new();

        public void Add(ProductDefinition product)
        {
            if (product == null || string.IsNullOrWhiteSpace(product.ProductId)) return;
            _products[product.ProductId] = product;
        }

        public bool TryGet(string productId, out ProductDefinition product) =>
            _products.TryGetValue(productId, out product);

        public IReadOnlyCollection<ProductDefinition> Products => _products.Values;
    }
}
