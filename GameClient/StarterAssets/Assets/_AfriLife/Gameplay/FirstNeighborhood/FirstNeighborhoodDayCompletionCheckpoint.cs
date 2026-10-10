using System;
using AfriLife.Core.Save;

namespace AfriLife.Gameplay.FirstNeighborhood
{
    /// <summary>
    /// Complete a scripted demo day only after committing and READING BACK
    /// the finished checkpoint. Caller keeps its previous validated loop if
    /// any write, readback or integrity check fails.
    /// </summary>
    public static class FirstNeighborhoodDayCompletionCheckpoint
    {
        public static bool TryCommit(
            FirstNeighborhoodPrototypeLoop candidate,
            Action<WorldSaveData> save,
            Func<WorldSaveData> reload,
            out FirstNeighborhoodPrototypeLoop committed,
            out string message)
        {
            committed=null;
            if(candidate==null || save==null || reload==null ||
               candidate.State==null || candidate.SaveData?.Header==null ||
               candidate.CurrentStep!="save-and-reload" ||
               candidate.State.NextStep!=FirstNeighborhoodPrototypeLoop.Steps.Length-1 ||
               candidate.State.DaysCompleted==int.MaxValue)
            {
                message="A verified, incomplete demo day is required.";
                return false;
            }
            string worldId=candidate.SaveData.Header.WorldId;
            int oldDayCount=candidate.State.DaysCompleted;
            if(string.IsNullOrWhiteSpace(worldId) ||
               !FirstNeighborhoodSaveIntegrity.Check(candidate.SaveData,out _))
            {
                message="The existing day checkpoint failed integrity checks.";
                return false;
            }

            // This mutates only the separately loaded candidate, not the
            // active HUD loop, until a verified readback confirms the save.
            if(!candidate.CompleteAfterVerifiedReload(out message))
                return false;
            try
            {
                save(candidate.SaveData);
                WorldSaveData verified=reload();
                if(verified==null || verified.Header==null ||
                   verified.Header.WorldId!=worldId ||
                   verified.FirstNeighborhoodPrototype==null ||
                   !FirstNeighborhoodSaveIntegrity.Check(verified,out _) ||
                   verified.FirstNeighborhoodPrototype.DaysCompleted!=oldDayCount+1 ||
                   verified.FirstNeighborhoodPrototype.NextStep!=
                       FirstNeighborhoodPrototypeLoop.Steps.Length ||
                   verified.FirstNeighborhoodPrototype.CompletedSteps==null ||
                   verified.FirstNeighborhoodPrototype.CompletedSteps.Length!=
                       FirstNeighborhoodPrototypeLoop.Steps.Length ||
                   verified.FirstNeighborhoodPrototype.CompletedSteps[
                       FirstNeighborhoodPrototypeLoop.Steps.Length-1]!="save-and-reload")
                {
                    message="Completed day was not verified after save; keep the previous day active.";
                    return false;
                }
                FirstNeighborhoodPrototypeLoop loaded=new FirstNeighborhoodPrototypeLoop(verified);
                committed=loaded;
                message="Demo day completed and verified after disk reload.";
                return true;
            }
            catch(Exception)
            {
                // Do not expose paths, credentials or full save payloads.
                message="Completed day was not saved or verified. Previous day remains active.";
                return false;
            }
        }
    }
}
