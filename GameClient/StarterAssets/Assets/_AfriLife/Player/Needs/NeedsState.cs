using System;
using System.Collections.Generic;

namespace AfriLife.Player.Needs
{
    [Serializable]
    public sealed class NeedsState
    {
        private readonly Dictionary<NeedType, float> _values = new();

        public float Get(NeedType type) =>
            _values.TryGetValue(type, out var value) ? value : 100f;

        public void Set(NeedType type, float value) =>
            _values[type] = Math.Clamp(value, 0f, 100f);

        public void Adjust(NeedType type, float delta) =>
            Set(type, Get(type) + delta);

        public IReadOnlyDictionary<NeedType, float> Snapshot() =>
            new Dictionary<NeedType, float>(_values);

        public void Reset(float value = 100f)
        {
            _values.Clear();
            foreach (NeedType type in Enum.GetValues(typeof(NeedType)))
            {
                Set(type, value);
            }
        }
    }
}
