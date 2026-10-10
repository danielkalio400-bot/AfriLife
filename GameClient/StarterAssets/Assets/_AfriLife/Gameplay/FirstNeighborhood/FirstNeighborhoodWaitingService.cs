using System;
using UnityEngine;

namespace AfriLife.Gameplay.FirstNeighborhood
{
    /// <summary>
    /// Local time passing at two existing, physically reachable neighborhood
    /// rest props. This is optional scripted play, not a real-life scheduler.
    /// </summary>
    public sealed class FirstNeighborhoodWaitingService
    {
        public const int MaxHourlyWaitsPerDay = 4;
        private const long HourSeconds = 3600L;
        private readonly FirstNeighborhoodPrototypeLoop _loop;

        public FirstNeighborhoodWaitingService(FirstNeighborhoodPrototypeLoop loop)
        {
            _loop=loop ?? throw new ArgumentNullException(nameof(loop));
        }

        public bool TryWaitAtNearbyRestSpot(
            FirstNeighborhoodWalkController actor,
            FirstNeighborhoodInteractionPoint[] sites,
            FirstNeighborhoodActivityProp[] props,out string message)
        {
            if(actor==null || sites==null || props==null)
            {
                message="Walking player and rest props are required.";
                return false;
            }
            string siteId=string.Empty;
            foreach(FirstNeighborhoodActivityProp prop in props)
            {
                if(prop==null || !prop.Contains(actor.transform.position))
                    continue;
                if(prop.PropId=="home-bed" && prop.SiteId=="home")
                {
                    siteId="home";
                    break;
                }
                if(prop.PropId=="park-area" && prop.SiteId=="park")
                {
                    siteId="park";
                    break;
                }
            }
            if(siteId.Length==0 || !FirstNeighborhoodInteractionPolicy.CanPerformSite(
                siteId,actor.transform.position,sites,out message))
            {
                message="Walk near the home bed or park activity spot to wait.";
                return false;
            }
            FirstNeighborhoodPrototypeState state=_loop.State;
            if(state.NextStep>=15) // Sleep, verified reload and complete.
            {
                message="Finish or begin the next demo day before waiting again.";
                return false;
            }
            if(state.WaitingSessionsDay>state.DaysCompleted)
            {
                message="Wait history is inconsistent; preserve the save.";
                return false;
            }
            int count=state.WaitingSessionsDay==state.DaysCompleted
                ?state.WaitingSessionsToday:0;
            if(count>=MaxHourlyWaitsPerDay)
            {
                message="Four hourly waits are already used for this game day.";
                return false;
            }
            int hour=FirstNeighborhoodWorldClock.HourOfDay(
                state.ElapsedWorldSeconds);
            if(hour<6 || hour>=20 ||
               state.ElapsedWorldSeconds>long.MaxValue-HourSeconds)
            {
                message="Waiting is available only from 06:00 to 20:00.";
                return false;
            }
            // All checks above run before modifying the save state.
            state.ElapsedWorldSeconds+=HourSeconds;
            state.WaitingSessionsDay=state.DaysCompleted;
            state.WaitingSessionsToday=count+1;
            _loop.Residents.AdvanceSchedule(state.ElapsedWorldSeconds);
            message="Waited one hour at "+siteId+". Local time: "+
                FirstNeighborhoodWorldClock.Display(state.ElapsedWorldSeconds);
            return true;
        }
    }
}
