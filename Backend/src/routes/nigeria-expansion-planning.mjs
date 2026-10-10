import { sendJson } from "../http/json.mjs";

export async function handleNigeriaExpansionPlanning(req,res,path,{expansion,contract}) {
  if(req.method==="GET" && path==="/v1/runtime/nigeria-expansion") {
    sendJson(res,200,contract);return true;
  }
  if(req.method==="GET" && path==="/v1/dev/nigeria-expansion/gate") {
    sendJson(res,200,expansion.readiness());return true;
  }
  if(req.method==="GET" && path==="/v1/dev/nigeria-expansion/cities") {
    sendJson(res,200,{plans:expansion.plans()});return true;
  }
  const match=path.match(/^\/v1\/dev\/nigeria-expansion\/cities\/([^/]+)$/);
  if(req.method==="GET" && match) {
    let name;
    try{name=decodeURIComponent(match[1]);}
    catch{sendJson(res,400,{error:"invalid_city_id"});return true;}
    const result=expansion.report(name);
    sendJson(res,result?200:404,result||{error:"nigeria_expansion_city_not_found"});
    return true;
  }
  // Manual evidence remains trusted QA only, never user-generated release claims.
  if(path.startsWith("/v1/dev/nigeria-expansion") && req.method!=="GET") {
    sendJson(res,403,{error:"internal_qa_review_required"});return true;
  }
  return false;
}
