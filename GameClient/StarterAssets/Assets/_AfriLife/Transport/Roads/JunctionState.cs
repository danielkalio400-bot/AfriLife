using System;

namespace AfriLife.Transport.Roads
{
    [Serializable]
    public sealed class JunctionState
    {
        public string JunctionId = string.Empty;
        public string RegionId = string.Empty;
        public bool Signalized;
        public bool Roundabout;
        public bool Powered = true;
        public float Congestion01;

        public void Normalize() => Congestion01 = Math.Clamp(Congestion01, 0f, 1f);
    }
}
