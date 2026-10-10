using System;

namespace AfriLife.Justice.Courts
{
    [Serializable]
    public sealed class AppealRecord
    {
        public string AppealId = string.Empty;
        public string CaseId = string.Empty;
        public string FiledByEntityId = string.Empty;
        public string ReasonTag = string.Empty;
        public string State = "filed";
        public long FiledAtUnixSeconds;
    }
}
