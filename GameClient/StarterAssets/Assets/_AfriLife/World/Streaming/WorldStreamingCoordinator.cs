using System;
using System.Collections.Generic;

namespace AfriLife.World.Streaming
{
    public sealed class WorldStreamingCoordinator
    {
        private readonly Dictionary<string, DistrictSimulationState> _districts = new();
        private readonly SimulationTierPolicy _policy;

        public WorldStreamingCoordinator(SimulationTierPolicy policy = null)
        {
            _policy = policy ?? new SimulationTierPolicy();
        }

        public IReadOnlyCollection<DistrictSimulationState> Districts => _districts.Values;

        public DistrictSimulationState Register(string districtId)
        {
            if (string.IsNullOrWhiteSpace(districtId))
                throw new ArgumentException("District id is required.", nameof(districtId));

            if (_districts.TryGetValue(districtId, out var existing))
                return existing;

            var state = new DistrictSimulationState { DistrictId = districtId };
            _districts.Add(districtId, state);
            return state;
        }

        public SimulationTier UpdateDistance(string districtId, float distanceKm)
        {
            var state = Register(districtId);
            state.Tier = _policy.Resolve(distanceKm);
            return state.Tier;
        }
    }
}
