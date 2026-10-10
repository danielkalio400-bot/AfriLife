using System;

namespace AfriLife.Logistics
{
    [Serializable]
    public sealed class CourierState
    {
        public string CourierId = string.Empty;
        public string PersonEntityId = string.Empty;
        public string CityId = string.Empty;
        public int ActiveDeliveries;
        public bool Available = true;
    }
}
