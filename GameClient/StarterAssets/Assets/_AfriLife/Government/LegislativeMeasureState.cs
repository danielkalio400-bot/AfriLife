using System;

namespace AfriLife.Government
{
    [Serializable]
    public sealed class LegislativeMeasureState
    {
        public string MeasureId = string.Empty;
        public string CountryId = string.Empty;
        public string TitleTag = string.Empty;
        public string Status = "introduced";
        public int VotesFor;
        public int VotesAgainst;
        public int Abstentions;
    }
}
