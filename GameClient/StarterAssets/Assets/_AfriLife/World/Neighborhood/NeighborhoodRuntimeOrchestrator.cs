using AfriLife.Infrastructure.Utilities;
using AfriLife.World.Weather;

namespace AfriLife.World.Neighborhood
{
    public sealed class NeighborhoodRuntimeOrchestrator
    {
        private readonly UtilityInterdependenceService _utilities = new();
        private readonly WeatherImpactService _weather = new();

        public void Advance(NeighborhoodRuntimeSnapshot snapshot)
        {
            if (snapshot == null) return;

            _weather.Apply(snapshot.Weather, null, snapshot.Power, snapshot.Telecom);
            _utilities.ApplyPowerToTelecom(snapshot.Power, snapshot.Telecom);

            snapshot.ActivePersistentNpcs = System.Math.Max(0, snapshot.ActivePersistentNpcs);
            snapshot.ActiveHouseholds = System.Math.Max(0, snapshot.ActiveHouseholds);
            snapshot.OpenServices = System.Math.Max(0, snapshot.OpenServices);
        }
    }
}
