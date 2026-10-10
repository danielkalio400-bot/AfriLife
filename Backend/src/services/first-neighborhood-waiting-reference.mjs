import {worldHourOfDay} from "./first-neighborhood-world-clock-reference.mjs";
const allowedRest={
 home:{x:-11.7,z:-5.6},
 park:{x:2,z:2}
};
export const MAX_HOURLY_WAITS=4;
export function advanceNeighborhoodWaiting(state,{
 siteId,avatarX,avatarZ,nearbyMarker=true
}={}){
 if(!state || !Number.isSafeInteger(state.elapsedWorldSeconds) ||
    state.elapsedWorldSeconds<0 || !Number.isSafeInteger(state.daysCompleted) ||
    state.daysCompleted<0 || !Number.isSafeInteger(state.nextStep) ||
    state.nextStep<0 || state.nextStep>=15 ||
    !Number.isSafeInteger(state.waitingSessionsDay??0) ||
    !Number.isSafeInteger(state.waitingSessionsToday??0))
   return {ok:false,error:"invalid_wait_state"};
 const prop=allowedRest[siteId];
 if(!prop || !Number.isFinite(avatarX)||!Number.isFinite(avatarZ)||
    nearbyMarker!==true || Math.hypot(avatarX-prop.x,avatarZ-prop.z)>3)
   return {ok:false,error:"rest_spot_out_of_range"};
 if((state.waitingSessionsDay??0)>state.daysCompleted ||
    (state.waitingSessionsToday??0)<0 ||
    (state.waitingSessionsToday??0)>MAX_HOURLY_WAITS)
   return {ok:false,error:"invalid_wait_history"};
 const count=(state.waitingSessionsDay??0)===state.daysCompleted
   ?state.waitingSessionsToday??0:0;
 if(count>=MAX_HOURLY_WAITS)
   return {ok:false,error:"daily_wait_limit"};
 const hour=worldHourOfDay(state.elapsedWorldSeconds);
 if(hour<6 || hour>=20 ||
    !Number.isSafeInteger(state.elapsedWorldSeconds+3600))
   return {ok:false,error:"outside_wait_hours"};
 return {ok:true,state:{
  ...state,elapsedWorldSeconds:state.elapsedWorldSeconds+3600,
  waitingSessionsDay:state.daysCompleted,waitingSessionsToday:count+1
 }};
}
export function resetNeighborhoodWaitingForNewDay(state){
 return {...state,waitingSessionsDay:state.daysCompleted,
  waitingSessionsToday:0};
}
