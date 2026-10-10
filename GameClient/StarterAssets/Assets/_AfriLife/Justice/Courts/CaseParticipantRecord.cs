using System;

namespace AfriLife.Justice.Courts
{
    [Serializable]
    public sealed class CaseParticipantRecord
    {
        public string ParticipantId = string.Empty;
        public string CaseId = string.Empty;
        public string PersonEntityId = string.Empty;
        public CourtRole Role;
        public bool Active = true;
    }
}
