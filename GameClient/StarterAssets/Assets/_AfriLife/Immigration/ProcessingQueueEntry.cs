using System;

namespace AfriLife.Immigration
{
    [Serializable]
    public sealed class ProcessingQueueEntry
    {
        public string QueueEntryId = string.Empty;
        public string ApplicationId = string.Empty;
        public string OfficeId = string.Empty;
        public int Position;
        public string Status = "waiting";
    }
}
