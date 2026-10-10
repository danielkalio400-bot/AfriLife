using System;

namespace AfriLife.Maritime
{
    [Serializable]
    public sealed class MaritimeCrewAssignment
    {
        public string AssignmentId = string.Empty;
        public string VoyageId = string.Empty;
        public string PersonEntityId = string.Empty;
        public MaritimeCrewRole Role;
        public bool Active = true;
    }
}
