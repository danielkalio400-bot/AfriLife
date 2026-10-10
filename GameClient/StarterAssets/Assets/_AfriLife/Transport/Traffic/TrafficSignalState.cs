using System;

namespace AfriLife.Transport.Traffic
{
    [Serializable]
    public sealed class TrafficSignalState
    {
        public string SignalId = string.Empty;
        public string JunctionId = string.Empty;
        public TrafficSignalPhase Phase = TrafficSignalPhase.Stop;
        public int PhaseSecondsRemaining;
        public bool Powered = true;
        public bool Faulted;
    }
}
