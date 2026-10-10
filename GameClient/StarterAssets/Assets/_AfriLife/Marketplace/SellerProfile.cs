using System;

namespace AfriLife.Marketplace
{
    [Serializable]
    public sealed class SellerProfile
    {
        public string SellerId = string.Empty;
        public string DisplayName = string.Empty;
        public string CountryId = string.Empty;
        public string BusinessId = string.Empty;
        public float Reputation01 = 0.5f;
        public int CompletedOrders;
        public bool Active = true;

        public void Normalize()
        {
            Reputation01 = Math.Clamp(Reputation01, 0f, 1f);
            CompletedOrders = Math.Max(0, CompletedOrders);
        }
    }
}
