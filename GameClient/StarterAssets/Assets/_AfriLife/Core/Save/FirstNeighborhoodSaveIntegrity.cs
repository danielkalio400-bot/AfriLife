using System;
using System.Collections.Generic;
using AfriLife.Gameplay.FirstNeighborhood;

namespace AfriLife.Core.Save
{
    /// <summary>
    /// Semantic checks complement the envelope SHA-256 checksum. A perfectly
    /// checksummed but internally inconsistent save is still not accepted.
    /// This is an offline corruption guard, NOT security against a local
    /// device owner rewriting both files and checksums.
    /// </summary>
    public static class FirstNeighborhoodSaveIntegrity
    {
        public static bool Check(WorldSaveData world, out string reason)
        {
            reason = string.Empty;
            if(world == null || world.Header == null || world.Player == null)
            {
                reason="missing-world";
                return false;
            }
            FirstNeighborhoodPrototypeState state=world.FirstNeighborhoodPrototype;
            if(state == null) return true; // Legacy world without the prototype.
            if(!string.Equals(state.ScenarioId,"lagos-first-district-prototype",
                StringComparison.Ordinal))
                return true; // Do not apply this prototype's rules to other modes.
            if(state.NextStep < 0 || state.NextStep > FirstNeighborhoodPrototypeLoop.Steps.Length ||
               state.DaysCompleted < 0 || state.ElapsedWorldSeconds < 0 ||
               state.WaitingSessionsDay < 0 ||
               state.WaitingSessionsDay > state.DaysCompleted ||
               state.WaitingSessionsToday < 0 ||
               state.WaitingSessionsToday > FirstNeighborhoodWaitingService.MaxHourlyWaitsPerDay)
            {
                reason="invalid-prototype-progress";
                return false;
            }
            string[] completed=state.CompletedSteps ?? Array.Empty<string>();
            if(completed.Length != state.NextStep)
            {
                reason="incomplete-prototype-ledger";
                return false;
            }
            for(int i=0;i<completed.Length;i++)
            {
                if(completed[i]!=FirstNeighborhoodPrototypeLoop.Steps[i])
                {
                    reason="out-of-order-prototype-ledger";
                    return false;
                }
            }
            if(state.DiscoveredSiteIds!=null)
            {
                if(state.DiscoveredSiteIds.Length>
                   FirstNeighborhoodLandmarkService.SiteIds.Length)
                {
                    reason="oversized-landmark-ledger";
                    return false;
                }
                var discovered=new HashSet<string>(StringComparer.Ordinal);
                foreach(string id in state.DiscoveredSiteIds)
                {
                    if(!FirstNeighborhoodLandmarkService.IsKnownSite(id) ||
                       !discovered.Add(id))
                    {
                        reason="duplicate-or-unknown-landmark";
                        return false;
                    }
                }
            }
            if(state.ErrandReceipts!=null)
            {
                if(state.ErrandReceipts.Count>50000)
                {
                    reason="oversized-errand-ledger";
                    return false;
                }
                var unique=new HashSet<string>(StringComparer.Ordinal);
                foreach(FirstNeighborhoodErrandReceipt receipt in state.ErrandReceipts)
                {
                    if(receipt==null || receipt.CompletedDay<0 ||
                       receipt.CompletedDay>state.DaysCompleted ||
                       receipt.WalletBalanceAfterMinorUnits<0 ||
                       string.IsNullOrWhiteSpace(receipt.ErrandId) ||
                       receipt.SiteId!=FirstNeighborhoodErrandService.RequiredSite(receipt.ErrandId))
                    {
                        reason="invalid-errand-receipt";
                        return false;
                    }
                    if(!unique.Add(receipt.CompletedDay+"|"+receipt.ErrandId))
                    {
                        reason="duplicate-errand-receipt";
                        return false;
                    }
                }
            }
            if(state.ConversationResidentIds!=null || state.ConversationCounts!=null)
            {
                string[] ids=state.ConversationResidentIds ?? Array.Empty<string>();
                int[] counts=state.ConversationCounts ?? Array.Empty<int>();
                if(ids.Length!=counts.Length || ids.Length>10000)
                {
                    reason="malformed-resident-history";
                    return false;
                }
                var residents=new HashSet<string>(StringComparer.Ordinal);
                for(int i=0;i<ids.Length;i++)
                {
                    if(string.IsNullOrWhiteSpace(ids[i]) || counts[i]<0 ||
                       !residents.Add(ids[i]))
                    {
                        reason="duplicate-or-invalid-resident";
                        return false;
                    }
                }
            }
            if(state.HasSavedPosition &&
                (float.IsNaN(state.PlayerX) || float.IsInfinity(state.PlayerX) ||
                 float.IsNaN(state.PlayerZ) || float.IsInfinity(state.PlayerZ)))
            {
                reason="invalid-player-position";
                return false;
            }
            return true;
        }
    }
}
