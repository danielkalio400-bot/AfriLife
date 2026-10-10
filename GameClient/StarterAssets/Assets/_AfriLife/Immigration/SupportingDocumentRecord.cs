using System;

namespace AfriLife.Immigration
{
    [Serializable]
    public sealed class SupportingDocumentRecord
    {
        public string DocumentId = string.Empty;
        public string ApplicationId = string.Empty;
        public string DocumentType = string.Empty;
        public string ReferenceTag = string.Empty;
        public bool AcceptedForReview;
    }
}
