using System;
using AfriLife.Economy.Money;

namespace AfriLife.Rail
{
    [Serializable]
    public sealed class RailTicketState
    {
        public string TicketId = string.Empty;
        public string ScheduleId = string.Empty;
        public string PassengerEntityId = string.Empty;
        public CurrencyCode Currency = CurrencyCode.NGN;
        public long FareMinorUnits;
        public bool Valid = true;
        public bool Used;
    }
}
