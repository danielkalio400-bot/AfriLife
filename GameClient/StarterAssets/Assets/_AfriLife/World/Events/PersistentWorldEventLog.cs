using System.Collections.Generic;
using System.Linq;

namespace AfriLife.World.Events
{
    public sealed class PersistentWorldEventLog
    {
        private readonly List<PersistentWorldEventRecord> _events = new();

        public void Append(PersistentWorldEventRecord worldEvent)
        {
            if (worldEvent == null || string.IsNullOrWhiteSpace(worldEvent.EventId))
                return;
            if (_events.Any(existing => existing.EventId == worldEvent.EventId))
                return;
            _events.Add(worldEvent);
        }

        public IReadOnlyList<PersistentWorldEventRecord> ActiveForRegion(string regionId) =>
            _events
                .Where(value => !value.Resolved && value.RegionId == regionId)
                .ToArray();

        public bool Resolve(string eventId)
        {
            var worldEvent = _events.Find(value => value.EventId == eventId);
            if (worldEvent == null) return false;
            worldEvent.Resolved = true;
            return true;
        }
    }
}
