import {createHash} from "node:crypto";
const digest=source=>createHash("sha256").update(source,"utf8").digest("hex");
const valid=envelope=>{
 if(!envelope || envelope.formatVersion!==1 ||
    !Number.isSafeInteger(envelope.generation) || envelope.generation<1 ||
    typeof envelope.payload!=="string" ||
    typeof envelope.sha256!=="string" ||
    envelope.sha256!==digest(envelope.payload))return null;
 try{
  const world=JSON.parse(envelope.payload);
  if(!world?.header?.worldId || !Number.isInteger(world?.header?.schemaVersion) ||
     world.header.schemaVersion!==1 || !world.player)
     return null;
  return {world,generation:envelope.generation};
 }catch{return null;}
};
export class FirstNeighborhoodSaveRecoveryReference {
 constructor(){this.slotA=null;this.slotB=null;this.legacy=null;}
 static envelope(world,generation) {
  const payload=JSON.stringify(world);
  return {formatVersion:1,generation,payload,sha256:digest(payload)};
 }
 read(){
  const a=valid(this.slotA),b=valid(this.slotB);
  if(a || b){
   const latest=(!a ? b : !b ? a :
     b.generation>a.generation ? b : a);
   return {ok:true,world:structuredClone(latest.world),
    generation:latest.generation,status:"loaded-verified-slot"};
  }
  if(this.legacy){
   try {
    const world=JSON.parse(this.legacy);
    if(world?.header?.worldId && world.header.schemaVersion===1 && world.player)
      return {ok:true,world,status:"loaded-legacy-save"};
   }catch{}
  }
  if(this.slotA || this.slotB || this.legacy)
    return {ok:false,error:"unrecoverable-save"};
  return {ok:false,error:"new-world"};
 }
 write(world,{interruptAfterStage=false}={}){
  if(!world?.header?.worldId || world.header.schemaVersion!==1 || !world.player)
    return {ok:false,error:"invalid-world"};
  const latest=this.read();
  if(latest.ok && latest.world.header.worldId!==world.header.worldId)
    return {ok:false,error:"world-identity-mismatch"};
  if(!latest.ok && latest.error!=="new-world")
    return {ok:false,error:"unrecoverable-save"};
  const a=valid(this.slotA),b=valid(this.slotB);
  const active=!a?"B":!b?"A":b.generation>a.generation?"B":"A";
  const target=!a && !b?"A":active==="A"?"B":"A";
  const generation=(latest.generation||0)+1;
  const staged=FirstNeighborhoodSaveRecoveryReference.envelope(world,generation);
  if(interruptAfterStage)return {ok:false,error:"interrupted-before-commit"};
  if(target==="A")this.slotA=staged;else this.slotB=staged;
  return {ok:true,target,generation};
 }
}
