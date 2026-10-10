/** Deterministic reference clock mirrored from FirstNeighborhoodWorldClock.cs. */
const DAY=86400,START=21600;
export const worldMinuteOfDay=seconds=>{
 if(!Number.isSafeInteger(seconds)||seconds<0)return null;
 return Math.floor(((seconds%DAY+START)%DAY)/60);
};
export const worldHourOfDay=seconds=>{
 const minute=worldMinuteOfDay(seconds);
 return minute===null?null:Math.floor(minute/60);
};
export const nextNeighborhoodMorning=seconds=>{
 if(!Number.isSafeInteger(seconds)||seconds<0)return null;
 const localSeconds=((seconds%DAY)+START)%DAY;
 let delta=(START-localSeconds+DAY)%DAY;
 if(delta===0)delta=DAY;
 const next=seconds+delta;
 return Number.isSafeInteger(next)?next:null;
};
export const isNeighborhoodServiceOpen=(id,elapsedWorldSeconds)=>{
 const hour=worldHourOfDay(elapsedWorldSeconds);
 if(hour===null)return false;
 const ranges={"clinic-checkin":[8,17],"market-supplies":[7,19],
  "park-cleanup":[6,20],"neighbor-help":[6,21]};
 const hours=ranges[id];
 return !!hours && hour>=hours[0]&&hour<hours[1];
};
