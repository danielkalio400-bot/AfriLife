using System;

namespace AfriLife.Construction
{
    [Serializable]
    public sealed class HouseDesignProposal
    {
        public string ProposalId = string.Empty;
        public string RequestId = string.Empty;
        public double EstimatedFloorAreaSquareMeters;
        public long EstimatedCostMinorUnits;
        public string[] RoomTags = Array.Empty<string>();
        public string[] Notes = Array.Empty<string>();
        public bool RequiresProfessionalReview = true;
    }
}
