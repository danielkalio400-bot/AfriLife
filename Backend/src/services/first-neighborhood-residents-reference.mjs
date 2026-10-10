export class FirstNeighborhoodResidentsReference {
 constructor() {
   this.records=new Map([
     ["prototype-resident-ada",{id:"prototype-resident-ada",talks:0,reputation:0}],
     ["prototype-resident-bola",{id:"prototype-resident-bola",talks:0,reputation:0}],
     ["prototype-resident-kwame",{id:"prototype-resident-kwame",talks:0,reputation:0}]
   ]);
 }
 activity(elapsedWorldSeconds) {
   if(!Number.isSafeInteger(elapsedWorldSeconds)||elapsedWorldSeconds<0)
     return {ok:false,error:"invalid_world_clock"};
   const hour=(6+Math.floor(elapsedWorldSeconds/3600))%24;
   return {ok:true,activity:hour<6||hour>=21?"sleep":
     hour<10?"commute":hour<17?"work":"social"};
 }
 talk({residentId,actorNear,elapsedWorldSeconds}) {
   const record=this.records.get(residentId);
   if(!record)return {ok:false,error:"unknown_resident"};
   if(actorNear!==true)return {ok:false,error:"out_of_range"};
   const schedule=this.activity(elapsedWorldSeconds);
   if(!schedule.ok)return schedule;
   if(schedule.activity==="sleep")return {ok:false,error:"resident_asleep"};
   record.talks=Math.min(100000,record.talks+1);
   record.reputation=Math.min(100,record.reputation+1);
   return {ok:true,record:{...record}};
 }
 save() {return JSON.stringify([...this.records.values()]);}
 load(data) {
   const records=JSON.parse(data);
   if(!Array.isArray(records)||records.length!==3||records.some(r=>
     !this.records.has(r.id)||!Number.isSafeInteger(r.talks)||r.talks<0))
     return {ok:false,error:"invalid_resident_save"};
   this.records=new Map(records.map(r=>[r.id,{...r}]));
   return {ok:true};
 }
 summary(id) {const p=this.records.get(id);return p?{...p}:null;}
}
