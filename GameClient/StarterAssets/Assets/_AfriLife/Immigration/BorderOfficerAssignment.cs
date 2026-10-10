using System;

namespace AfriLife.Immigration
{
    [Serializable]
    public sealed class BorderOfficerAssignment
    {
        public string AssignmentId = string.Empty;
        public string OfficerEntityId = string.Empty;
        public string BorderPointId = string.Empty;
        public string ShiftTag = string.Empty;
        public bool Active = true;
    }
}
