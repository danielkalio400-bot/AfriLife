using System;

namespace AfriLife.Player.Needs
{
    [Serializable]
    public struct NeedRate
    {
        public NeedType Type;
        public float DeltaPerGameHour;

        public NeedRate(NeedType type, float deltaPerGameHour)
        {
            Type = type;
            DeltaPerGameHour = deltaPerGameHour;
        }
    }
}
