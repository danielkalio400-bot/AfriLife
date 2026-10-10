using System;
using AfriLife.Player.Needs;

namespace AfriLife.Core.Save
{
    [Serializable]
    public sealed class NeedValueRecord
    {
        public NeedType Type;
        public float Value;
    }
}
