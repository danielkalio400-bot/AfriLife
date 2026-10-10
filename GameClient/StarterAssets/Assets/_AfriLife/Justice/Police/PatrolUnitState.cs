using System;

namespace AfriLife.Justice.Police
{
    [Serializable]
    public sealed class PatrolUnitState
    {
        public string UnitId = string.Empty;
        public string RegionId = string.Empty;
        public string StationId = string.Empty;
        public string AssignedZoneId = string.Empty;
        public bool Available = true;
        public bool OnPatrol;
    }
}
