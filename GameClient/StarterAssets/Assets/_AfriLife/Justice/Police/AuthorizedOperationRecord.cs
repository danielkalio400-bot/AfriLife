using System;

namespace AfriLife.Justice.Police
{
    [Serializable]
    public sealed class AuthorizedOperationRecord
    {
        public string OperationId = string.Empty;
        public string CaseId = string.Empty;
        public string OperationType = string.Empty;
        public string LegalAuthorityRef = string.Empty;
        public string Status = "authorized";
        public string OutcomeTag = string.Empty;
        public long AuthorizedAtUnixSeconds;
    }
}
