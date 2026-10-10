import {validateFirstNeighborhoodLedger} from "./first-neighborhood-save-recovery-reference.mjs";

export const completedSteps=Object.freeze([
 "wake","shower","dress","eat","use-phone","buy-mobile-data",
 "travel-or-drive","work","earn-money","shop","exercise",
 "interact-with-persistent-npcs","pay-bills","return-home",
 "sit-or-lie-down","sleep","save-and-reload"
]);

/**
 * Reference for the two-stage Unity end-of-day checkpoint. A verified
 * pre-completion state must already exist in the dual-slot save. Only the
 * fully verified committed readback may become the active player state.
 */
export function completeFirstNeighborhoodDay(store,{interruptAfterStage=false}={}){
 if(!store || typeof store.read!=="function"||typeof store.write!=="function")
   return {ok:false,error:"checkpoint_store_required"};
 const checkpoint=store.read();
 if(!checkpoint.ok)return {ok:false,error:"prior_checkpoint_unavailable"};
 const world=checkpoint.world,step=world?.firstNeighborhoodPrototype;
 if(!step || step.scenarioId!=="lagos-first-district-prototype" ||
    !Number.isSafeInteger(step.daysCompleted) ||
    step.daysCompleted>=2147483647 ||
    step.nextStep!==16 ||
    !Array.isArray(step.completedSteps) ||
    step.completedSteps.length!==16 ||
    step.completedSteps.some((s,i)=>s!==completedSteps[i]) ||
    !validateFirstNeighborhoodLedger(world).ok)
   return {ok:false,error:"incomplete_day"};
 const candidate=structuredClone(world);
 const oldDays=step.daysCompleted,worldId=world.header.worldId;
 candidate.firstNeighborhoodPrototype.completedSteps.push("save-and-reload");
 candidate.firstNeighborhoodPrototype.nextStep=17;
 candidate.firstNeighborhoodPrototype.daysCompleted=oldDays+1;
 const written=store.write(candidate,{interruptAfterStage});
 if(!written.ok)
   return {ok:false,error:"checkpoint_write_failed",cause:written.error};
 const after=store.read(),next=after?.world?.firstNeighborhoodPrototype;
 if(!after.ok || after.world.header.worldId!==worldId ||
    !validateFirstNeighborhoodLedger(after.world).ok ||
    next?.daysCompleted!==oldDays+1 ||
    next.nextStep!==17 ||
    next.completedSteps?.length!==17 ||
    next.completedSteps[16]!=="save-and-reload")
   return {ok:false,error:"checkpoint_readback_failed"};
 return {ok:true,world:after.world,generation:after.generation};
}
