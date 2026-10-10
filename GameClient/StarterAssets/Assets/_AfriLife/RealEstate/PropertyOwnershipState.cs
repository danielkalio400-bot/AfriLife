using System;
using AfriLife.Economy.Money;

namespace AfriLife.RealEstate
{
    [Serializable]
    public sealed class PropertyOwnershipState
    {
        public string PropertyId = string.Empty;
        public string OwnerEntityId = string.Empty;
        public string CountryId = string.Empty;
        public string CityId = string.Empty;
        public string NeighborhoodId = string.Empty;
        public PropertyType Type;
        public CurrencyCode Currency = CurrencyCode.NGN;
        public long PurchasePriceMinorUnits;
        public long EstimatedValueMinorUnits;
        public bool Occupied;
        public bool ForRent;
        public bool ForSale;

        public void Normalize()
        {
            PurchasePriceMinorUnits = Math.Max(0L, PurchasePriceMinorUnits);
            EstimatedValueMinorUnits = Math.Max(0L, EstimatedValueMinorUnits);
        }
    }
}
