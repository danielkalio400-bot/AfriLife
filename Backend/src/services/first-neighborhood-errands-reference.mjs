import {readFileSync} from "node:fs";
export const neighborhoodErrandsContract=JSON.parse(readFileSync(
  new URL("../../../Shared/contracts/first-neighborhood-errands.json",import.meta.url),"utf8"
));
export class FirstNeighborhoodErrandsReference {
  #ledger=new Map();
  #funds;
  #needs={health:50,comfort:50,social:50};
  #supplies=0;
  constructor({fundsMinorUnits=5000}={}) {
    if(!Number.isSafeInteger(fundsMinorUnits)||fundsMinorUnits<0)throw new Error("invalid_wallet");
    this.#funds=fundsMinorUnits;
  }
  get funds(){return this.#funds;}
  get supplies(){return this.#supplies;}
  get needs(){return {...this.#needs};}
  receipts(){return [...this.#ledger.values()].map(x=>({...x}));}
  perform({id,siteId,day,nearby=false,residentReady=false}={}) {
    const row=neighborhoodErrandsContract.activities.find(x=>x.id===id);
    if(!row || row.siteId!==siteId || !Number.isSafeInteger(day)||day<0)
      return {ok:false,error:"invalid_errand"};
    const key=day+"|"+id;
    const earlier=this.#ledger.get(key);
    if(earlier)return {ok:true,replay:true,receipt:{...earlier}};
    if(nearby!==true)return {ok:false,error:"out_of_range"};
    if(row.requiresNamedResident && residentReady!==true)
      return {ok:false,error:"resident_unavailable"};
    if(row.costMinorUnits && this.#funds<row.costMinorUnits)
      return {ok:false,error:"insufficient_funds"};
    this.#funds+=row.earnMinorUnits||0;
    this.#funds-=row.costMinorUnits||0;
    if(id==="clinic-checkin")this.#needs.health=Math.min(100,this.#needs.health+5);
    if(id==="market-supplies")this.#supplies++;
    if(id==="park-cleanup")this.#needs.comfort=Math.min(100,this.#needs.comfort+4);
    if(id==="neighbor-help")this.#needs.social=Math.min(100,this.#needs.social+5);
    const receipt={id,siteId,day,balanceMinorUnits:this.#funds};
    this.#ledger.set(key,receipt);
    return {ok:true,replay:false,receipt:{...receipt}};
  }
  export(){
    return JSON.stringify({funds:this.#funds,needs:this.#needs,
      supplies:this.#supplies,receipts:this.receipts()});
  }
  static restore(serialized) {
    let data;
    try{data=JSON.parse(serialized)}catch{return null;}
    if(!Number.isSafeInteger(data?.funds)||data.funds<0 ||
      !Array.isArray(data.receipts)||data.receipts.length>5000 ||
      !Number.isSafeInteger(data.supplies)||data.supplies<0 ||
      !data.needs || !["health","comfort","social"].every(k=>
        Number.isFinite(data.needs[k])&&data.needs[k]>=0&&data.needs[k]<=100))
      return null;
    const result=new FirstNeighborhoodErrandsReference({fundsMinorUnits:data.funds});
    result.#needs={...data.needs};
    result.#supplies=data.supplies;
    for(const receipt of data.receipts){
      if(!neighborhoodErrandsContract.activities.some(a=>a.id===receipt.id&&a.siteId===receipt.siteId) ||
        !Number.isSafeInteger(receipt.day)||receipt.day<0 ||
        !Number.isSafeInteger(receipt.balanceMinorUnits)||receipt.balanceMinorUnits<0)
        return null;
      const key=receipt.day+"|"+receipt.id;
      if(result.#ledger.has(key))return null;
      result.#ledger.set(key,{...receipt});
    }
    return result;
  }
}
