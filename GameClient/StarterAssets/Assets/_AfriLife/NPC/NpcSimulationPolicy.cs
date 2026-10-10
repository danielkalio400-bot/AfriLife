using AfriLife.World.Streaming;

namespace AfriLife.NPC
{
    public sealed class NpcSimulationPolicy
    {
        public double TickIntervalSeconds(SimulationTier tier)
        {
            return tier switch
            {
                SimulationTier.ActiveDistrict => 0.1d,
                SimulationTier.NeighboringRegion => 1.0d,
                _ => 30.0d
            };
        }

        public bool UsesFullNavigation(SimulationTier tier) =>
            tier == SimulationTier.ActiveDistrict;

        public bool UsesFullAnimation(SimulationTier tier) =>
            tier == SimulationTier.ActiveDistrict;
    }
}
