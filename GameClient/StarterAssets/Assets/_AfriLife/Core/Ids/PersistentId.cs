using System;

namespace AfriLife.Core.Ids
{
    [Serializable]
    public readonly struct PersistentId
    {
        public string Value { get; }
        public PersistentId(string value) => Value = value;
        public static PersistentId New() => new(Guid.NewGuid().ToString("N"));
        public override string ToString() => Value;
    }
}
