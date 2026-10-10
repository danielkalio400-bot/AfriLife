using System;

namespace AfriLife.Media
{
    [Serializable]
    public sealed class MediaOutletState
    {
        public string OutletId = string.Empty;
        public string CountryId = string.Empty;
        public string DisplayName = string.Empty;
        public MediaChannelType ChannelType;
        public bool Fictional = true;
        public bool Active = true;
    }
}
