using System;

namespace AfriLife.Construction
{
    [Serializable]
    public sealed class ConstructionMaterialRequirement
    {
        public string MaterialId = string.Empty;
        public double RequiredUnits;
        public double DeliveredUnits;
        public long UnitCostMinorUnits;

        public void Normalize()
        {
            RequiredUnits = Math.Max(0d, RequiredUnits);
            DeliveredUnits = Math.Clamp(DeliveredUnits, 0d, RequiredUnits);
            UnitCostMinorUnits = Math.Max(0L, UnitCostMinorUnits);
        }

        public bool Fulfilled
        {
            get
            {
                Normalize();
                return DeliveredUnits >= RequiredUnits;
            }
        }
    }
}
