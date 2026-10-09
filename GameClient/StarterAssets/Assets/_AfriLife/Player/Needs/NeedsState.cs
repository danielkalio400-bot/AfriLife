using System;
using System.Collections.Generic;

namespace AfriLife.Player.Needs
{
    [Serializable]
    public sealed class NeedsState
    {
        private readonly Dictionary<NeedType, float> _values = new();
        public float Get(NeedType type) => _values.TryGetValue(type, out var value) ? value : 100f;
        public void Set(NeedType type, float value) => _values[type] = Math.Clamp(value, 0f, 100f);
    }
}
