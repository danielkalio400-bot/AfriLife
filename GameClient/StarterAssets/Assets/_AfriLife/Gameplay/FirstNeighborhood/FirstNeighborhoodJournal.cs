using System;
using System.Text;

namespace AfriLife.Gameplay.FirstNeighborhood
{
    /// <summary>
    /// Read-only local journal over the existing canonical prototype save.
    /// It does not create a secondary wallet, quest ledger or save slot.
    /// </summary>
    public static class FirstNeighborhoodJournal
    {
        public static readonly string[] Pages = {
            "Today","Places","People","Errands"
        };

        public static string Render(FirstNeighborhoodPrototypeState state,int page)
        {
            if(state==null)return "No neighborhood journal loaded.";
            var summary=new StringBuilder(400);
            switch(page)
            {
                case 0:
                    summary.AppendLine("DAY "+(state.DaysCompleted+1));
                    summary.AppendLine("Local time: "+
                        FirstNeighborhoodWorldClock.Display(state.ElapsedWorldSeconds));
                    summary.AppendLine("Daily actions: "+state.NextStep+"/"+
                        FirstNeighborhoodPrototypeLoop.Steps.Length);
                    summary.AppendLine("Completed days: "+state.DaysCompleted);
                    int waits=state.WaitingSessionsDay==state.DaysCompleted
                        ?state.WaitingSessionsToday:0;
                    summary.AppendLine("Hourly waits: "+waits+"/"+
                        FirstNeighborhoodWaitingService.MaxHourlyWaitsPerDay);
                    int next=state.NextStep;
                    if(next>=FirstNeighborhoodPrototypeLoop.Steps.Length)
                        summary.AppendLine("Day finished; start the next day.");
                    else if(next>=0)
                        summary.AppendLine("Next: "+
                            FirstNeighborhoodPrototypeLoop.Steps[next]);
                    break;
                case 1:
                    string[] discovered=state.DiscoveredSiteIds ??
                        Array.Empty<string>();
                    summary.AppendLine("VISITED LANDMARKS ("+discovered.Length+"/"+
                        FirstNeighborhoodLandmarkService.SiteIds.Length+")");
                    foreach(string site in FirstNeighborhoodLandmarkService.SiteIds)
                        summary.AppendLine((Array.IndexOf(discovered,site)>=0?
                            "Visited: ":"Not visited: ")+site);
                    break;
                case 2:
                    summary.AppendLine("NEIGHBORS");
                    string[] ids=state.ConversationResidentIds ?? Array.Empty<string>();
                    int[] counts=state.ConversationCounts ?? Array.Empty<int>();
                    string[] residentIds={"prototype-resident-ada",
                        "prototype-resident-bola","prototype-resident-kwame"};
                    string[] names={"Ada","Bola","Kwame"};
                    for(int i=0;i<residentIds.Length;i++)
                    {
                        int at=Array.IndexOf(ids,residentIds[i]);
                        int conversations=at>=0 && at<counts.Length?
                            Math.Max(0,counts[at]):0;
                        summary.AppendLine(names[i]+": "+conversations+" conversations");
                    }
                    break;
                case 3:
                    summary.AppendLine("TODAY'S OPTIONAL ERRANDS");
                    string[] namesOfErrands=FirstNeighborhoodErrandService.ErrandIds;
                    bool[] finished=new bool[namesOfErrands.Length];
                    if(state.ErrandReceipts!=null)
                        foreach(FirstNeighborhoodErrandReceipt item in state.ErrandReceipts)
                        {
                            if(item==null || item.CompletedDay!=state.DaysCompleted)
                                continue;
                            int index=Array.IndexOf(namesOfErrands,item.ErrandId);
                            if(index>=0)finished[index]=true;
                        }
                    for(int i=0;i<namesOfErrands.Length;i++)
                        summary.AppendLine((finished[i]?"Completed: ":"Available: ")+
                            namesOfErrands[i]);
                    summary.AppendLine("Receipt history is stored in the same world save.");
                    break;
                default:
                    return "Unknown journal page.";
            }
            return summary.ToString();
        }
    }
}
