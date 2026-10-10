using System;

namespace AfriLife.Transport.PublicTransit
{
    [Serializable]
    public sealed class PublicTransitRoute
    {
        public string RouteId = string.Empty;
        public string OperatorId = string.Empty;
        public string OriginStopId = string.Empty;
        public string DestinationStopId = string.Empty;
        public PublicTransitType Type;
        public int HeadwayMinutes = 15;
        public long FareMinorUnits;
        public string CurrencyCode = string.Empty;
        public bool Active = true;
    }
}
