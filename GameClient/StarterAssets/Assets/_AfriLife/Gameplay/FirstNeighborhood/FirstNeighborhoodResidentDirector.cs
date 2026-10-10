using System;
using AfriLife.Core.Save;
using AfriLife.NPC;
using AfriLife.NPC.Scheduling;
using UnityEngine;

namespace AfriLife.Gameplay.FirstNeighborhood
{
    /// <summary>Connects a physical scene resident to existing serialized NPC state.</summary>
    public sealed class FirstNeighborhoodResidentDirector : MonoBehaviour
    {
        public FirstNeighborhoodResidentAgent Resident;
        private WorldSaveData _save;

        public void Bind(WorldSaveData save)
        {
            _save = save;
            if (_save == null || Resident == null) return;
            _save.Normalize();
            NpcRuntimeState npc = GetOrCreate();
            npc.Profile.DisplayName = Resident.DisplayName;
            npc.Profile.CurrentCityId = "Lagos";
            ApplyStep(_save.FirstNeighborhoodPrototype?.NextStep ?? 0);
        }

        private NpcRuntimeState GetOrCreate()
        {
            NpcRuntimeState record = _save.PersistentNpcs.Find(
                npc => npc != null && npc.Profile != null &&
                    npc.Profile.Id == Resident.ResidentId);
            if (record != null) return record;
            record = new NpcRuntimeState();
            record.Profile.Id = Resident.ResidentId;
            record.Profile.DisplayName = Resident.DisplayName;
            record.Profile.CurrentCityId = "Lagos";
            record.Profile.HomeId = "first-neighborhood-home";
            record.Schedule.NpcId = Resident.ResidentId;
            record.CurrentLocationId = "neighbor";
            record.CurrentActivity = NpcScheduleActivity.Social;
            _save.PersistentNpcs.Add(record);
            return record;
        }

        public void ApplyStep(int nextStep)
        {
            if (_save == null || Resident == null) return;
            // Playable visit phase: the resident stays near the neighbor
            // interaction marker. Other phases use illustrative daily routes.
            string place = nextStep >= 10 && nextStep <= 12 ? "neighbor" :
                nextStep >= 6 && nextStep <= 9 ? "workplace" : "home";
            Vector3 destination = place == "neighbor"
                ? new Vector3(6.2f, 0f, 3.1f)
                : place == "workplace"
                    ? new Vector3(11.5f, 0f, 6.6f)
                    : new Vector3(-9f, 0f, -6.6f);
            GetOrCreate().CurrentLocationId = place;
            GetOrCreate().CurrentActivity = place == "workplace"
                ? NpcScheduleActivity.Work
                : place == "neighbor"
                    ? NpcScheduleActivity.Social : NpcScheduleActivity.Home;
            GetOrCreate().AtWork = place == "workplace";
            Resident.MoveTo(destination);
        }

        public bool CanConverse(Vector3 playerPosition, out string reason)
        {
            if (_save == null || Resident == null)
            {
                reason = "Neighborhood resident is not loaded.";
                return false;
            }
            if (_save.FirstNeighborhoodPrototype?.NextStep != 11)
            {
                reason = "It is not the conversation step.";
                return false;
            }
            NpcRuntimeState npc = GetOrCreate();
            if (npc.CurrentLocationId != "neighbor" ||
                !Resident.CanConverse(playerPosition))
            {
                reason = "Walk closer to the resident and say hello.";
                return false;
            }
            reason = Resident.DisplayName + ": Nice to see you in the neighborhood.";
            return true;
        }

        public void RecordConversation()
        {
            if (_save == null) return;
            var state = _save.FirstNeighborhoodPrototype;
            if (state == null) return;
            // Interaction is called only after the player's ordered day-one
            // step successfully advances; never repeats a reward or payment.
            if (state.LastConversationDay == state.DaysCompleted) return;
            state.ConversationCount++;
            state.LastConversationDay = state.DaysCompleted;
        }
    }
}
