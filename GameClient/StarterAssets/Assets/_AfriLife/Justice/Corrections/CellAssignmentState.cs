using System;

namespace AfriLife.Justice.Corrections
{
    [Serializable]
    public sealed class CellAssignmentState
    {
        public string AssignmentId = string.Empty;
        public string RecordId = string.Empty;
        public string FacilityId = string.Empty;
        public string CellId = string.Empty;
        public int Capacity = 1;
        public int Occupancy = 1;
    }
}
