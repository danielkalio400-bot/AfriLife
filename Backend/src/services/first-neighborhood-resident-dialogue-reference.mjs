import {worldHourOfDay}
 from "./first-neighborhood-world-clock-reference.mjs";

const topics=Object.freeze({
 "prototype-resident-ada":{name:"Ada",
   morning:"The neighborhood square is waking up.",
   day:"You can walk around to discover our local places.",
   evening:"Evening is a good time to catch up with neighbors."},
 "prototype-resident-bola":{name:"Bola",
   morning:"The market is getting ready for the day.",
   day:"Visit the market counter when you need supplies.",
   evening:"The shops are settling down for the evening."},
 "prototype-resident-kwame":{name:"Kwame",
   morning:"It's quiet by the park this morning.",
   day:"The park is a good place to enjoy a walk.",
   evening:"There is still time for a short stroll."}
});
export function firstNeighborhoodInformalChat({
 residentId,actorNear,awake,elapsedWorldSeconds,
 conversationResidentIds=[],conversationCounts=[]
}={}){
 if(actorNear!==true)
   return {ok:false,error:"out_of_range"};
 const known=topics[residentId];
 if(!known)return {ok:false,error:"unknown_resident"};
 const hour=worldHourOfDay(elapsedWorldSeconds);
 if(hour===null)return {ok:false,error:"invalid_world_clock"};
 if(awake!==true || hour<6 || hour>=21)
   return {ok:false,error:"resident_unavailable"};
 if(!Array.isArray(conversationResidentIds)||
    !Array.isArray(conversationCounts)||
    conversationResidentIds.length!==conversationCounts.length)
   return {ok:false,error:"invalid_conversation_history"};
 const i=conversationResidentIds.indexOf(residentId);
 const familiar=i>=0&&conversationCounts[i]>0;
 const topic=hour<10?known.morning:hour<17?known.day:known.evening;
 return {ok:true,dialogue:known.name+": "+
   (familiar?"Good to see you again. ":"Hello, welcome. ")+topic,
   persisted:false,progression:false,reputationDelta:0,
   affectsDailyStep:false};
}
