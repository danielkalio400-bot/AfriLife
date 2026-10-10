using System.Collections.Generic;
using UnityEngine;

namespace AfriLife.Player.Needs
{
    public sealed class NeedsComponent : MonoBehaviour
    {
        [SerializeField] private List<NeedRate> rates = new()
        {
            new NeedRate(NeedType.Hunger, -3f),
            new NeedRate(NeedType.Thirst, -4f),
            new NeedRate(NeedType.Energy, -2f),
            new NeedRate(NeedType.Hygiene, -1.25f),
            new NeedRate(NeedType.Bladder, -2.5f),
            new NeedRate(NeedType.Fun, -0.8f),
            new NeedRate(NeedType.Social, -0.6f),
            new NeedRate(NeedType.Comfort, -0.5f)
        };

        private readonly NeedsState _state = new();
        private readonly NeedsSimulator _simulator = new();

        public NeedsState State => _state;

        private void Awake()
        {
            _state.Reset();
        }

        public void AdvanceGameSeconds(double gameSeconds)
        {
            _simulator.Advance(_state, rates, gameSeconds);
        }
    }
}
