using System;

namespace AfriLife.Health
{
    [Serializable]
    public sealed class PharmacyStockItem
    {
        public string ProductId = string.Empty;
        public int Quantity;
        public int ReorderThreshold;
        public bool PrescriptionRestricted;

        public void Normalize()
        {
            Quantity = Math.Max(0, Quantity);
            ReorderThreshold = Math.Max(0, ReorderThreshold);
        }

        public bool NeedsReorder
        {
            get
            {
                Normalize();
                return Quantity <= ReorderThreshold;
            }
        }
    }
}
