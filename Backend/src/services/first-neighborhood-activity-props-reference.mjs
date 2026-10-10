import {neighborhoodRouteCue} from "./first-neighborhood-route-reference.mjs";
export const activityProps=Object.freeze([
 {id:"home-bed",site:"home",x:-11.7,z:-5.6,steps:["wake","sit-or-lie-down","sleep","save-and-reload"]},
 {id:"home-sink",site:"home",x:-12.2,z:-6.2,steps:["shower"]},
 {id:"home-wardrobe",site:"home",x:-10.1,z:-6.1,steps:["dress"]},
 {id:"home-table",site:"home",x:-11,z:-6.2,steps:["eat"]},
 {id:"home-phone",site:"home",x:-10.3,z:-5.5,steps:["use-phone","buy-mobile-data"]},
 {id:"home-door",site:"home",x:-11,z:-6.9,steps:["return-home"]},
 {id:"work-desk",site:"workplace",x:10,z:4.8,steps:["travel-or-drive","work","earn-money"]},
 {id:"market-counter",site:"market",x:9,z:-4.8,steps:["shop"]},
 {id:"park-area",site:"park",x:2,z:2,steps:["exercise"]},
 {id:"neighbor-circle",site:"neighbor",x:6,z:3,steps:["interact-with-persistent-npcs"]},
 {id:"bank-window",site:"bank",x:-7,z:7.3,steps:["pay-bills"]}
]);
export function checkPhysicalAction(step,avatar,markers=activityProps,reach=3){
 if(!avatar || !Number.isFinite(avatar.x) || !Number.isFinite(avatar.z))
   return {ok:false,error:"player_controller_required"};
 const target=neighborhoodRouteCue(step,avatar,reach);
 if(!target.ok || !target.withinReach)
   return {ok:false,error:"destination_not_reached"};
 const props=markers.filter(prop=>prop.site===target.siteId &&
   prop.steps?.includes(step));
 if(props.length===0)return {ok:false,error:"activity_prop_missing"};
 if(!props.some(prop=>Math.hypot(prop.x-avatar.x,prop.z-avatar.z)<=reach))
   return {ok:false,error:"activity_prop_out_of_range"};
 return {ok:true,siteId:target.siteId};
}
