namespace AfriLife.World.Streaming
{
    public sealed class SimulationTierPolicy
    {
        public float ActiveDistrictRadiusKm { get; set; } = 3f;
        public float NeighboringRegionRadiusKm { get; set; } = 25f;

        public SimulationTier Resolve(float distanceKm)
        {
            if (distanceKm <= ActiveDistrictRadiusKm)
                return SimulationTier.ActiveDistrict;

            if (distanceKm <= NeighboringRegionRadiusKm)
                return SimulationTier.NeighboringRegion;

            return SimulationTier.StatisticalFarRegion;
        }
    }
}
