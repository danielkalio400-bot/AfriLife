import {FIRST_NEIGHBORHOOD_SITES} from "./first-neighborhood-landmarks-reference.mjs";
const validPos=p=>p && Number.isFinite(p.x) && Number.isFinite(p.z);
export function landmarkCompassCue(targetSite,position,{reach=3,sites=FIRST_NEIGHBORHOOD_SITES}={}){
 if(!validPos(position)||!Number.isFinite(reach)||reach<1||reach>7 ||
    !FIRST_NEIGHBORHOOD_SITES.some(s=>s.id===targetSite) ||
    !Array.isArray(sites))
   return {ok:false,error:"invalid_landmark_destination"};
 const valid=sites.filter(x=>x&&x.id===targetSite&&validPos(x));
 if(!valid.length)return {ok:false,error:"missing_landmark_marker"};
 const closest=valid.reduce((best,next)=>
   Math.hypot(next.x-position.x,next.z-position.z)<
   Math.hypot(best.x-position.x,best.z-position.z)?next:best);
 const dx=closest.x-position.x,dz=closest.z-position.z;
 const directMeters=Math.hypot(dx,dz);
 const arrived=directMeters<=reach;
 const direction=arrived?"HERE":
   Math.abs(dx)>Math.abs(dz)?(dx>=0?"E":"W"):(dz>=0?"N":"S");
 return {ok:true,siteId:targetSite,directMeters,direction,arrived,
   isStraightLineOnly:true};
}
export function closestUnvisitedLandmark(state,position,{sites=FIRST_NEIGHBORHOOD_SITES}={}){
 if(!state||!Array.isArray(state.discoveredSiteIds)||
    !validPos(position) ||new Set(state.discoveredSiteIds).size!==
    state.discoveredSiteIds.length ||
    state.discoveredSiteIds.some(id=>
      !FIRST_NEIGHBORHOOD_SITES.some(s=>s.id===id)))
   return {ok:false,error:"invalid_visited_landmarks"};
 let chosen=null;
 for(const site of FIRST_NEIGHBORHOOD_SITES){
  if(state.discoveredSiteIds.includes(site.id))continue;
  const cue=landmarkCompassCue(site.id,position,{sites});
  if(cue.ok && (!chosen || cue.directMeters<chosen.directMeters))
    chosen=cue;
 }
 return chosen??{ok:false,error:"no_unvisited_marker"};
}
