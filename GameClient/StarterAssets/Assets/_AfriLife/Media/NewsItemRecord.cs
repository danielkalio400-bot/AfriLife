using System;

namespace AfriLife.Media
{
    [Serializable]
    public sealed class NewsItemRecord
    {
        public string NewsId = string.Empty;
        public string OutletId = string.Empty;
        public string CountryId = string.Empty;
        public NewsTopic Topic;
        public string HeadlineTag = string.Empty;
        public string SummaryTag = string.Empty;
        public string RegionId = string.Empty;
        public string SourceSystemTag = string.Empty;
        public int Urgency;
        public long PublishedAtUnixSeconds;
    }
}
