import { readJson, sendJson } from "../http/json.mjs";

export async function handleDiplomacyPeace(req,res,path,{diplomacy,contract}) {
  if(req.method==="GET" && path==="/v1/runtime/diplomacy-peace") {
    sendJson(res,200,contract);return true;
  }
  if(req.method==="GET" && path==="/v1/dev/diplomacy/relation") {
    sendJson(res,200,diplomacy.relation());return true;
  }
  if(req.method==="GET" && path==="/v1/dev/diplomacy/proposals") {
    sendJson(res,200,{proposals:diplomacy.proposals()});return true;
  }
  if(req.method==="GET" && path==="/v1/dev/diplomacy/reconstruction") {
    const url=new URL(req.url||"/","http://localhost");
    sendJson(res,200,{projects:diplomacy.reconstruction(url.searchParams.get("countryId")||"")});
    return true;
  }
  const commands={
    "/v1/dev/diplomacy/proposals": input=>diplomacy.propose(input),
    "/v1/dev/diplomacy/decisions": input=>diplomacy.decide(input),
    "/v1/dev/diplomacy/reconstruction": input=>diplomacy.fundReconstruction(input)
  };
  if(req.method==="POST" && Object.hasOwn(commands,path)) {
    try {
      const result=commands[path](await readJson(req));
      sendJson(res,result.ok?200:400,result.ok?result:{error:result.error});
    } catch(error) {
      sendJson(res,400,{error:error?.code||"invalid_request"});
    }
    return true;
  }
  return false;
}
