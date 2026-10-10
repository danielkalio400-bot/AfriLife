const sites=Object.freeze({
 home:[-11,-6.5],market:[9,-4.8],workplace:[10,4.8],
 bank:[-7,7.3],park:[2,2],neighbor:[6,3],clinic:[0,8.9]
});
const siteForStep=step=>{
 if(["travel-or-drive","work","earn-money"].includes(step))return "workplace";
 if(step==="shop")return "market";
 if(step==="exercise")return "park";
 if(step==="interact-with-persistent-npcs")return "neighbor";
 if(step==="pay-bills")return "bank";
 return "home";
};
export function neighborhoodRouteCue(step,{x,z},reach=3) {
 if(!Number.isFinite(x)||!Number.isFinite(z)||!Number.isFinite(reach)||
   reach<=0)return {ok:false,error:"invalid_position"};
 const siteId=siteForStep(step),[targetX,targetZ]=sites[siteId];
 const dx=targetX-x,dz=targetZ-z,meters=Math.hypot(dx,dz);
 const direction=meters<=reach?"HERE":
   Math.abs(dx)>Math.abs(dz)?(dx>=0?"E":"W"):(dz>=0?"N":"S");
 return {ok:true,siteId,straightLineMeters:meters,
   direction,withinReach:meters<=reach};
}
export function validateNeighborhoodMarkers(markers,residentIds) {
 const issues=[];
 if(!Array.isArray(markers)||!Array.isArray(residentIds))
   return {ok:false,issues:["invalid_scene"]};
 for(const id of Object.keys(sites))
   if(markers.filter(x=>x===id).length!==1)
     issues.push("marker_"+id);
 for(const id of ["prototype-resident-ada","prototype-resident-bola",
   "prototype-resident-kwame"])
   if(residentIds.filter(x=>x===id).length!==1)
     issues.push("resident_"+id);
 return {ok:issues.length===0,issues};
}
