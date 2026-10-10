using System;

namespace AfriLife.Construction
{
    [Serializable]
    public sealed class HouseDesignRequest
    {
        public string RequestId = string.Empty;
        public string PropertyId = string.Empty;
        public double MaximumFloorAreaSquareMeters;
        public int BedroomCount = 2;
        public int BathroomCount = 1;
        public int FloorCount = 1;
        public long BudgetMinorUnits;
        public string[] PreferenceTags = Array.Empty<string>();

        public void Normalize()
        {
            MaximumFloorAreaSquareMeters = Math.Max(1d, MaximumFloorAreaSquareMeters);
            BedroomCount = Math.Clamp(BedroomCount, 0, 20);
            BathroomCount = Math.Clamp(BathroomCount, 0, 20);
            FloorCount = Math.Clamp(FloorCount, 1, 10);
            BudgetMinorUnits = Math.Max(0L, BudgetMinorUnits);
            PreferenceTags ??= Array.Empty<string>();
        }
    }
}
