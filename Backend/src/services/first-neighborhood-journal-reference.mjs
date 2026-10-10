const ids=["home","market","workplace","bank","park","neighbor","clinic"];
const people=[["prototype-resident-ada","Ada"],
 ["prototype-resident-bola","Bola"],["prototype-resident-kwame","Kwame"]];
const errands=["clinic-checkin","market-supplies","park-cleanup","neighbor-help"];
export const JOURNAL_PAGES=Object.freeze(["Today","Places","People","Errands"]);

/** Read-only projection of the existing saved neighborhood state. */
export function readNeighborhoodJournal(state,page="Today") {
 if(!state || !JOURNAL_PAGES.includes(page) ||
    !Number.isInteger(state.daysCompleted)||state.daysCompleted<0)
    return {ok:false,error:"invalid_journal_state"};
 const day=state.daysCompleted,lines=[];
 if(page==="Today"){
  const progress=state.nextStep??0;
  if(!Number.isInteger(progress)||progress<0||progress>17)
    return {ok:false,error:"invalid_journal_progress"};
  lines.push("DAY "+(day+1),"Daily actions: "+progress+"/17",
    "Completed days: "+day);
  const waits=state.waitingSessionsDay===day?
    state.waitingSessionsToday??0:0;
  lines.push("Hourly waits: "+waits+"/4");
 }else if(page==="Places"){
  const visited=state.discoveredSiteIds??[];
  if(!Array.isArray(visited)||new Set(visited).size!==visited.length ||
     visited.some(id=>!ids.includes(id)))
    return {ok:false,error:"invalid_landmark_history"};
  lines.push("VISITED LANDMARKS ("+visited.length+"/7)");
  for(const id of ids)
    lines.push((visited.includes(id)?"Visited: ":"Not visited: ")+id);
 }else if(page==="People"){
  const residentIds=state.conversationResidentIds??[];
  const counts=state.conversationCounts??[];
  if(!Array.isArray(residentIds)||!Array.isArray(counts)||
     residentIds.length!==counts.length)
    return {ok:false,error:"invalid_resident_history"};
  lines.push("NEIGHBORS");
  for(const [id,name] of people){
    const index=residentIds.indexOf(id);
    const count=index>=0?counts[index]:0;
    lines.push(name+": "+count+" conversations");
  }
 }else{
  const receipts=state.errandReceipts??[];
  if(!Array.isArray(receipts))return {ok:false,error:"invalid_errand_history"};
  lines.push("TODAY'S OPTIONAL ERRANDS");
  for(const id of errands)
    lines.push((receipts.some(r=>r?.completedDay===day&&r.errandId===id)?
      "Completed: ":"Available: ")+id);
 }
 return {ok:true,page,lines,daysCompleted:day,
   grantsMoney:false,changesSave:false};
}
