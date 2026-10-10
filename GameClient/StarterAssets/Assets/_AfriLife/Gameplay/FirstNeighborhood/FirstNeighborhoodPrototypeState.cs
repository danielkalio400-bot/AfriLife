using System;

namespace AfriLife.Gameplay.FirstNeighborhood
{
    // Saved inside WorldSaveData. This is an original scripted prototype,
    // not certified day-to-day free roaming or a production economy.
    [Serializable]
    public sealed class FirstNeighborhoodPrototypeState
    {
        public string ScenarioId = "lagos-first-district-prototype";
        public string CurrentLocation = "home";
        public int NextStep;
        public int DaysCompleted;
        public int ConversationCount;
        public int LastConversationDay = -1;
        public long ElapsedWorldSeconds;
        public bool Started;
        public bool HasSavedPosition;
        public float PlayerX;
        public float PlayerZ;
        public string[] CompletedSteps = Array.Empty<string>();
        public System.Collections.Generic.List<FirstNeighborhoodErrandReceipt> ErrandReceipts = new();
        public string[] ConversationResidentIds = Array.Empty<string>();
        public int[] ConversationCounts = Array.Empty<int>();

        public void Normalize(int stepsCount)
        {
            NextStep = Math.Max(0, Math.Min(stepsCount, NextStep));
            DaysCompleted = Math.Max(0, DaysCompleted);
            ConversationCount = Math.Max(0, ConversationCount);
            LastConversationDay = Math.Max(-1, LastConversationDay);
            ElapsedWorldSeconds = Math.Max(0, ElapsedWorldSeconds);
            CompletedSteps ??= Array.Empty<string>();
            if (CompletedSteps.Length > NextStep)
                Array.Resize(ref CompletedSteps, NextStep);
            CurrentLocation ??= "home";
            ErrandReceipts ??= new System.Collections.Generic.List<FirstNeighborhoodErrandReceipt>();
            ErrandReceipts.RemoveAll(item => item == null || item.CompletedDay < 0 || string.IsNullOrWhiteSpace(item.ErrandId));
            ConversationResidentIds ??= Array.Empty<string>();
            ConversationCounts ??= Array.Empty<int>();
            if (ConversationResidentIds.Length != ConversationCounts.Length)
            {
                // Truncate unpaired legacy/corrupt entries without changing IDs.
                int length = Math.Min(ConversationResidentIds.Length,ConversationCounts.Length);
                Array.Resize(ref ConversationResidentIds,length);
                Array.Resize(ref ConversationCounts,length);
            }
            for(int i=0;i<ConversationCounts.Length;i++)
                ConversationCounts[i]=Math.Max(0,ConversationCounts[i]);
            if (float.IsNaN(PlayerX) || float.IsInfinity(PlayerX) ||
                float.IsNaN(PlayerZ) || float.IsInfinity(PlayerZ))
            {
                HasSavedPosition=false;
                PlayerX=0f;
                PlayerZ=0f;
            }
        }
    }
}
