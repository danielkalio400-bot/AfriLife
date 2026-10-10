using System;

namespace AfriLife.Gameplay.FirstNeighborhood
{
    /// <summary>
    /// Short offline conversational scene feedback from the three original
    /// scheduled residents. Casual dialogue is read-only; the existing
    /// daily-life step alone persists conversations and reputation.
    /// </summary>
    public static class FirstNeighborhoodResidentDialogue
    {
        public static bool TryChat(FirstNeighborhoodPrototypeLoop loop,
            FirstNeighborhoodWalkController player,
            FirstNeighborhoodResidentAgent agent,out string dialogue)
        {
            if(loop==null || player==null || agent==null ||
               !agent.InConversationRange(player.transform.position))
            {
                dialogue="Walk closer to an available neighbor to chat.";
                return false;
            }
            var npc=loop.Residents.Find(agent.ResidentId);
            if(npc==null || npc.Sleeping || npc.Profile==null)
            {
                dialogue="This neighbor is not available now.";
                return false;
            }
            int hour=FirstNeighborhoodWorldClock.HourOfDay(
                loop.State.ElapsedWorldSeconds);
            if(hour<6 || hour>=21)
            {
                dialogue="Neighbors are resting. Visit during the day.";
                return false;
            }

            string[] ids=loop.State.ConversationResidentIds ??
                Array.Empty<string>();
            int[] counts=loop.State.ConversationCounts ??
                Array.Empty<int>();
            int index=Array.IndexOf(ids,agent.ResidentId);
            bool familiar=index>=0 && index<counts.Length && counts[index]>0;
            string greeting=familiar?"Good to see you again. ":"Hello, welcome. ";
            string topic=Topic(agent.ResidentId,hour);
            if(topic==null)
            {
                dialogue="Unknown neighborhood resident.";
                return false;
            }
            dialogue=npc.Profile.DisplayName+": "+greeting+topic;
            return true;
        }

        private static string Topic(string id,int hour)
        {
            if(id=="prototype-resident-ada")
                return hour<10
                    ? "The neighborhood square is waking up."
                    : hour<17
                        ? "You can walk around to discover our local places."
                        : "Evening is a good time to catch up with neighbors.";
            if(id=="prototype-resident-bola")
                return hour<10
                    ? "The market is getting ready for the day."
                    : hour<17
                        ? "Visit the market counter when you need supplies."
                        : "The shops are settling down for the evening.";
            if(id=="prototype-resident-kwame")
                return hour<10
                    ? "It's quiet by the park this morning."
                    : hour<17
                        ? "The park is a good place to enjoy a walk."
                        : "There is still time for a short stroll.";
            return null;
        }
    }
}
