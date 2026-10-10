using System;

namespace AfriLife.RealEstate
{
    [Serializable]
    public sealed class PropertyValuationInputs
    {
        public long BaseValueMinorUnits;
        public float NeighborhoodValueIndex01 = 0.5f;
        public float Condition01 = 1f;
        public float UtilityAccess01 = 1f;
        public float TransportAccess01 = 0.5f;
        public float ServiceAccess01 = 0.5f;

        public void Normalize()
        {
            BaseValueMinorUnits = Math.Max(0L, BaseValueMinorUnits);
            NeighborhoodValueIndex01 = Math.Clamp(NeighborhoodValueIndex01, 0f, 1f);
            Condition01 = Math.Clamp(Condition01, 0f, 1f);
            UtilityAccess01 = Math.Clamp(UtilityAccess01, 0f, 1f);
            TransportAccess01 = Math.Clamp(TransportAccess01, 0f, 1f);
            ServiceAccess01 = Math.Clamp(ServiceAccess01, 0f, 1f);
        }
    }
}
