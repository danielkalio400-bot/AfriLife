using System;
using System.Collections.Generic;

namespace AfriLife.Immigration
{
    [Serializable]
    public sealed class VisaApplicationRecord
    {
        public string ApplicationId = string.Empty;
        public string PersonEntityId = string.Empty;
        public string DestinationCountryId = string.Empty;
        public string VisaCategory = string.Empty;
        public VisaApplicationState State = VisaApplicationState.Draft;
        public string ProcessingOfficeId = string.Empty;
        public List<string> SupportingDocumentIds = new();
        public long SubmittedAtUnixSeconds;
        public long UpdatedAtUnixSeconds;
    }
}
