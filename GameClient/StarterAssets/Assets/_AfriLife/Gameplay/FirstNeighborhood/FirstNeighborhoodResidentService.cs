using System;
using System.Collections.Generic;
using AfriLife.Core.Save;
using AfriLife.NPC;
using AfriLife.NPC.Scheduling;

namespace AfriLife.Gameplay.FirstNeighborhood
{
    /// <summary>
    /// Small deterministic local neighborhood cast using the existing
    /// WorldSaveData.PersistentNpcs authority. No server and no NPC AI.
    /// Residents have stable IDs, a daypart routine and persistent reputation.
    /// </summary>
    public sealed class FirstNeighborhoodResidentService
    {
        private readonly WorldSaveData _world;
        private static readonly (string id, string name, string site)[] Seed = {
            ("prototype-resident-ada", "Ada", "neighbor"),
            ("prototype-resident-bola", "Bola", "market"),
            ("prototype-resident-kwame", "Kwame", "park")
        };
        public FirstNeighborhoodResidentService(WorldSaveData world)
        {
            _world = world ?? throw new ArgumentNullException(nameof(world));
            _world.Normalize();
            foreach (var seed in Seed)
            {
                if (Find(seed.id) != null) continue;
                _world.PersistentNpcs.Add(new NpcRuntimeState {
                    Profile = new NpcProfile {
                        Id = seed.id, DisplayName = seed.name,
                        HomeId = "prototype-neighbor-housing",
                        CurrentCityId = "Lagos", Energy = 100f
                    },
                    Schedule = new NpcDailySchedule { NpcId = seed.id },
                    CurrentLocationId = seed.site,
                    CurrentActivity = NpcScheduleActivity.Social
                });
            }
        }

        public NpcRuntimeState Find(string residentId)
        {
            if (string.IsNullOrWhiteSpace(residentId)) return null;
            return _world.PersistentNpcs.Find(item =>
                item != null && item.Profile != null &&
                item.Profile.Id == residentId &&
                item.Profile.Id.StartsWith("prototype-resident-",StringComparison.Ordinal) &&
                item.Profile.CurrentCityId == "Lagos");
        }

        public IReadOnlyList<NpcRuntimeState> Residents()
        {
            var list = new List<NpcRuntimeState>();
            foreach (var seed in Seed)
            {
                var npc = Find(seed.id);
                if (npc != null) list.Add(npc);
            }
            return list;
        }

        public void AdvanceSchedule(long elapsedWorldSeconds)
        {
            int hour=FirstNeighborhoodWorldClock.HourOfDay(elapsedWorldSeconds);
            foreach (NpcRuntimeState npc in Residents())
            {
                // Reversible, predetermined low-cost daypart schedule.
                if (hour < 6 || hour >= 21)
                {
                    npc.CurrentActivity = NpcScheduleActivity.Sleep;
                    npc.CurrentLocationId = "home";
                    npc.Sleeping = true;
                }
                else if (hour < 10)
                {
                    npc.CurrentActivity = NpcScheduleActivity.Commute;
                    npc.CurrentLocationId = "neighbor";
                    npc.Sleeping = false;
                }
                else if (hour < 17)
                {
                    npc.CurrentActivity = NpcScheduleActivity.Work;
                    npc.CurrentLocationId =
                        npc.Profile.Id == "prototype-resident-ada" ? "neighbor" :
                            npc.Profile.Id == "prototype-resident-kwame" ? "park" : "market";
                    npc.Sleeping = false;
                }
                else
                {
                    npc.CurrentActivity = NpcScheduleActivity.Social;
                    npc.CurrentLocationId = "neighbor";
                    npc.Sleeping = false;
                }
            }
        }

        public bool TryConversation(string residentId, FirstNeighborhoodPrototypeState state,
            out string message)
        {
            NpcRuntimeState npc=Find(residentId);
            if (npc == null || state == null || npc.Sleeping)
            {
                message = "Resident is unavailable.";
                return false;
            }
            state.ConversationResidentIds ??= Array.Empty<string>();
            state.ConversationCounts ??= Array.Empty<int>();
            int existing = Array.IndexOf(state.ConversationResidentIds,residentId);
            if (existing < 0)
            {
                var ids = new List<string>(state.ConversationResidentIds) {residentId};
                var counts = new List<int>(state.ConversationCounts) {1};
                state.ConversationResidentIds=ids.ToArray();
                state.ConversationCounts=counts.ToArray();
            }
            else if (existing < state.ConversationCounts.Length &&
                     state.ConversationCounts[existing] < 100000)
            {
                state.ConversationCounts[existing]++;
            }
            npc.Profile.Reputation=Math.Min(100f,npc.Profile.Reputation+1f);
            message="Spoke with "+npc.Profile.DisplayName+".";
            return true;
        }
    }
}
