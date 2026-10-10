using System;

namespace AfriLife.Immigration
{
    [Serializable]
    public sealed class ImmigrationOfficeState
    {
        public string OfficeId = string.Empty;
        public string CountryId = string.Empty;
        public string CityId = string.Empty;
        public string OfficeType = "immigration-office";
        public int DailyProcessingCapacity;
        public int CurrentQueueLength;
        public bool Open = true;
    }
}
