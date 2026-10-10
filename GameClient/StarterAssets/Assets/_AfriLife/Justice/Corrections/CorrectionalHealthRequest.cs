using System;

namespace AfriLife.Justice.Corrections
{
    [Serializable]
    public sealed class CorrectionalHealthRequest
    {
        public string RequestId = string.Empty;
        public string RecordId = string.Empty;
        public string Priority = "routine";
        public string Status = "requested";
        public long RequestedAtUnixSeconds;
    }
}
