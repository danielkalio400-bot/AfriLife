using System;

namespace AfriLife.Rail
{
    [Serializable]
    public sealed class RailCrewAssignment
    {
        public string AssignmentId = string.Empty;
        public string ScheduleId = string.Empty;
        public string PersonEntityId = string.Empty;
        public RailCrewRole Role;
        public bool Active = true;
    }
}
