/**
 * Offline reference for physical scene landmark discovery. Site coordinates
 * mirror the seven existing authored scene interaction markers, not real maps.
 */
export const FIRST_NEIGHBORHOOD_SITES=Object.freeze([
 {id:"home",x:-11,z:-6.5},
 {id:"market",x:9,z:-4.8},
 {id:"workplace",x:10,z:4.8},
 {id:"bank",x:-7,z:7.3},
 {id:"park",x:2,z:2},
 {id:"neighbor",x:6,z:3},
 {id:"clinic",x:0,z:8.9}
]);
export function discoverFirstNeighborhoodLandmark(state,{
 x,z,siteId,reach=3
}={}){
 if(!state || !Array.isArray(state.discoveredSiteIds) ||
    !Number.isFinite(x)||!Number.isFinite(z)||
    !Number.isFinite(reach)||reach<1||reach>7)
   return {ok:false,error:"invalid_discovery_state"};
 if(state.discoveredSiteIds.length>FIRST_NEIGHBORHOOD_SITES.length ||
    new Set(state.discoveredSiteIds).size!==state.discoveredSiteIds.length ||
    state.discoveredSiteIds.some(id=>
      !FIRST_NEIGHBORHOOD_SITES.some(site=>site.id===id)))
   return {ok:false,error:"corrupt_landmark_ledger"};
 const site=FIRST_NEIGHBORHOOD_SITES.find(item=>item.id===siteId);
 if(!site || Math.hypot(x-site.x,z-site.z)>reach)
   return {ok:false,error:"landmark_not_reached"};
 if(state.discoveredSiteIds.includes(siteId))
   return {ok:true,newDiscovery:false,state:structuredClone(state)};
 return {ok:true,newDiscovery:true,state:{
  ...structuredClone(state),discoveredSiteIds:[...state.discoveredSiteIds,siteId]
 }};
}
