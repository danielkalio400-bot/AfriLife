using System;

namespace AfriLife.Core.Save
{
    [Serializable]
    public sealed class WorldSaveHeader
    {
        public int SchemaVersion = 1;
        public string WorldId = string.Empty;
        public string PlayerCharacterId = string.Empty;
        public string LastActiveDistrictId = string.Empty;
        public long SavedAtUnixSeconds;
    }
}
