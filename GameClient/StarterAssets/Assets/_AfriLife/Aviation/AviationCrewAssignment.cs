using System;

namespace AfriLife.Aviation
{
    [Serializable]
    public sealed class AviationCrewAssignment
    {
        public string AssignmentId = string.Empty;
        public string FlightId = string.Empty;
        public string PersonEntityId = string.Empty;
        public AviationCrewRole Role;
        public bool Active = true;
    }
}
