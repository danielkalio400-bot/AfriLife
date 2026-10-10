using System;

namespace AfriLife.Housing.Appliances
{
    [Serializable]
    public sealed class ApplianceState
    {
        public string ApplianceId = string.Empty;
        public ApplianceType Type;
        public bool IsOn;
        public bool RequiresElectricity = true;
        public float Condition = 100f;

        public void Normalize()
        {
            Condition = Math.Clamp(Condition, 0f, 100f);
        }
    }
}
