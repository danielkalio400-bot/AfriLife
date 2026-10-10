using System;

namespace AfriLife.World.Cities
{
    [Serializable]
    public sealed class NigeriaExpansionGateState
    {
        public string milestone = "first-serious-playable-neighborhood";
        public int totalRequirements;
        public int passedCount;
        public string[] missing = Array.Empty<string>();
        public string[] failing = Array.Empty<string>();
        public bool gateSatisfied;
        public bool releaseApproved;

        // QA completion is not equivalent to completed map development.
        public bool CanRequestEditorReview()
        {
            return gateSatisfied && missing != null && failing != null &&
                missing.Length == 0 && failing.Length == 0;
        }
    }
}
