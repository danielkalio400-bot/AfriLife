using System;

namespace AfriLife.Government
{
    [Serializable]
    public sealed class PublicProjectState
    {
        public string ProjectId = string.Empty;
        public string CountryId = string.Empty;
        public string RegionId = string.Empty;
        public string ProjectType = string.Empty;
        public long ApprovedBudgetMinorUnits;
        public long SpentMinorUnits;
        public double Progress01;
        public string Status = "planned";
    }
}
