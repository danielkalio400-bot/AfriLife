using System;

namespace AfriLife.World.Events
{
    [Serializable]
    public sealed class WorldImpactEvent
    {
        public string EventId = string.Empty;
        public string RegionId = string.Empty;
        public string EventType = string.Empty;
        public float Severity01;
        public string[] AffectedSystems = Array.Empty<string>();
        public long StartsAtUnixSeconds;
        public long EndsAtUnixSeconds;
    }
}
