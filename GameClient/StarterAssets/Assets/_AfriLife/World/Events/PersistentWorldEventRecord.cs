using System;

namespace AfriLife.World.Events
{
    [Serializable]
    public sealed class PersistentWorldEventRecord
    {
        public string EventId = string.Empty;
        public string EventType = string.Empty;
        public string RegionId = string.Empty;
        public string RelatedEntityId = string.Empty;
        public string PayloadJson = "{}";
        public long OccurredAtUnixSeconds;
        public bool Resolved;
    }
}
