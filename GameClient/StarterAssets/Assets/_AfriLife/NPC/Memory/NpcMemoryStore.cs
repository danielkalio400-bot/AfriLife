using System.Collections.Generic;

namespace AfriLife.NPC.Memory
{
    public sealed class NpcMemoryStore
    {
        private readonly Dictionary<string, List<NpcMemoryRecord>> _byNpc = new();

        public void Add(NpcMemoryRecord record)
        {
            if (record == null || string.IsNullOrWhiteSpace(record.NpcId)) return;

            if (!_byNpc.TryGetValue(record.NpcId, out var list))
            {
                list = new List<NpcMemoryRecord>();
                _byNpc.Add(record.NpcId, list);
            }

            list.Add(record);
        }

        public IReadOnlyList<NpcMemoryRecord> Get(string npcId)
        {
            return _byNpc.TryGetValue(npcId, out var list)
                ? list
                : System.Array.Empty<NpcMemoryRecord>();
        }
    }
}
