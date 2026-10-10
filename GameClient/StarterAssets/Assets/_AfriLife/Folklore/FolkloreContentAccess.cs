namespace AfriLife.Folklore
{
    public static class FolkloreContentAccess
    {
        // Client visibility only; a real server must separately authorize
        // ownership and explicit per-character preferences.
        public static bool CanRender(string mode, bool contentWarningsAcknowledged)
        {
            return contentWarningsAcknowledged &&
                   (mode == "ambiguous" || mode == "supernatural");
        }

        public static bool CanShowStory(FolkloreStoryState story, string characterId,
            string currentMode, bool contentWarningsAcknowledged)
        {
            return story != null && story.CharacterId == characterId &&
                   story.IsOptionalFiction &&
                   CanRender(currentMode, contentWarningsAcknowledged) &&
                   story.Status != "paused-opt-out";
        }
    }
}
