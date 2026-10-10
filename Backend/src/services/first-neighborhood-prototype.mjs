// Deterministic Node mirror of the Unity scripted vertical-slice action order.
// Used by CI for economic invariants; it is not a replacement for Unity tests.
import { readFileSync } from "node:fs";
export const firstNeighborhoodPrototypeContract = JSON.parse(readFileSync(
 new URL("../../../Shared/contracts/first-neighborhood-prototype.json",import.meta.url),"utf8"
));
export class FirstNeighborhoodPrototypeReference {
 constructor() { this.reset(); }
 reset() {
  this.steps=firstNeighborhoodPrototypeContract.steps;
  this.next=0;this.balance=5000;this.meals=1;this.groceries=0;
  this.mobileData=0;this.shifts=0;this.workReady=false;this.location="home";
  this.days=0;this.savedCheckpoint=null;this.completed=[];
 }
 action(step) {
  if(step!==this.steps[this.next])return {ok:false,error:"out_of_order"};
  if(step==="save-and-reload")return {ok:false,error:"reload_required"};
  if(step==="eat" && this.meals<1)return {ok:false,error:"meal_unavailable"};
  if(["buy-mobile-data","shop","pay-bills"].includes(step)){
   const cost={ "buy-mobile-data":200,shop:350,"pay-bills":400}[step];
   if(this.balance<cost)return {ok:false,error:"insufficient_funds"};
   this.balance-=cost;
  }
  if(step==="eat")this.meals--;
  if(step==="buy-mobile-data")this.mobileData+=100;
  if(step==="travel-or-drive")this.location="market-workplace";
  if(step==="work"){if(this.location!=="market-workplace")return {ok:false,error:"not_at_work"};
   this.shifts++;this.workReady=true;}
  if(step==="earn-money"){if(!this.workReady)return {ok:false,error:"shift_missing"};
   this.balance+=900;this.workReady=false;}
  if(step==="shop")this.groceries++;
  if(step==="return-home")this.location="home";
  this.completed.push(step);this.next++;
  return {ok:true,next:this.steps[this.next]};
 }
 save() {this.savedCheckpoint=JSON.stringify({
    next:this.next,balance:this.balance,meals:this.meals,groceries:this.groceries,
    mobileData:this.mobileData,shifts:this.shifts,workReady:this.workReady,
    location:this.location,completed:this.completed
  });return this.savedCheckpoint;}
 reload(raw) {
  const saved=JSON.parse(raw);
  if(!saved || !Number.isInteger(saved.next) || saved.next<0 ||
    saved.next>this.steps.length-1 || saved.completed?.length!==saved.next)
    return {ok:false,error:"invalid_checkpoint"};
  for(const key of Object.keys(saved))this[key]=structuredClone(saved[key]);
  if(this.steps[this.next]==="save-and-reload"){
   this.next++;this.completed.push("save-and-reload");this.days++;
  }
  return {ok:true,completed:this.next===this.steps.length};
 }
}