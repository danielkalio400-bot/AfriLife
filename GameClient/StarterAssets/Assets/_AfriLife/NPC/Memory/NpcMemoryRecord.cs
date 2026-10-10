using System;

namespace AfriLife.NPC.Memory
{
    [Serializable]
    public sealed class NpcMemoryRecord
    {
        public string MemoryId = string.Empty;
        public string NpcId = string.Empty;
        public NpcMemoryKind Kind;
        public string RelatedEntityId = string.Empty;
        public string SummaryKey = string.Empty;
        public float Importance;
        public long OccurredAtUnixSeconds;
    }
}
