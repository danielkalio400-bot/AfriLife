using System;
using AfriLife.NPC.Scheduling;

namespace AfriLife.NPC
{
    public sealed class NpcSimulationService
    {
        private readonly NpcScheduleResolver _resolver = new();

        public void Advance(NpcRuntimeState state, DateTime worldTime)
        {
            if (state?.Schedule == null) return;
            int minute = worldTime.Hour * 60 + worldTime.Minute;
            var entry = _resolver.Resolve(state.Schedule, minute);
            if (entry == null) return;

            state.CurrentActivity = entry.Activity;
            state.CurrentLocationId = entry.LocationId;
            state.Sleeping = entry.Activity == NpcScheduleActivity.Sleep;
            state.AtWork = entry.Activity == NpcScheduleActivity.Work;
        }
    }
}
