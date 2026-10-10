using System;

namespace AfriLife.World.Events
{
    public sealed class WorldImpactResolver
    {
        public float ClampSeverity(float severity) => Math.Clamp(severity, 0f, 1f);

        public bool Affects(WorldImpactEvent worldEvent, string system)
        {
            if (worldEvent?.AffectedSystems == null || string.IsNullOrWhiteSpace(system))
                return false;

            return Array.Exists(
                worldEvent.AffectedSystems,
                value => string.Equals(value, system, StringComparison.OrdinalIgnoreCase));
        }
    }
}
