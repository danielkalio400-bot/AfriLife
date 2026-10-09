import { createServer } from "node:http";

export function makeServer() {
  return createServer((req, res) => {
    const path = (req.url || "").split("?")[0];
    const send = (status, body) => {
      res.writeHead(status, {"content-type":"application/json; charset=utf-8","cache-control":"no-store"});
      res.end(JSON.stringify(body));
    };
    if (req.method === "GET" && path === "/health")
      return send(200, {ok:true, service:"afrilife-api", productionReady:false});
    if (req.method === "GET" && path === "/v1/status")
      return send(200, {project:"AfriLife", stage:"architecture-scaffold"});
    return send(404, {error:"not_found"});
  });
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const server = makeServer();
  server.listen(4200, "127.0.0.1", () => console.log("AfriLife local API: http://127.0.0.1:4200"));
}
