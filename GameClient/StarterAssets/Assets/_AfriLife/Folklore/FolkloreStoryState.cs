using System;
using UnityEngine;

namespace AfriLife.Folklore
{
    // Serializability for optional local presentation; authority remains with
    // the owning world simulation. No religious or real-world truth claims.
    [Serializable]
    public sealed class FolkloreStoryState
    {
        public string StoryId = string.Empty;
        public string CharacterId = string.Empty;
        public string CountryId = string.Empty;
        public string RegionId = string.Empty;
        public string PropertyId = string.Empty;
        public string Theme = string.Empty;
        public string Mode = "off";
        public string Stage = "strange-signs";
        public string Status = "active";
        public string OutcomeTag = string.Empty;
        [Range(0f,1f)] public float PropertyReputation01 = 0.5f;
        [Range(0f,1f)] public float HouseholdUncertainty01;

        public bool IsOptionalFiction { get { return Mode == "ambiguous" || Mode == "supernatural"; } }
        public void Normalize()
        {
            PropertyReputation01 = Mathf.Clamp01(PropertyReputation01);
            HouseholdUncertainty01 = Mathf.Clamp01(HouseholdUncertainty01);
        }
    }
}
