import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import {
  cityCatalog,
  systemRegistry,
  platformTargets,
  dailyLifeLoop,
  jobsCatalog,
  shopCatalog,
  billTypes,
  bankCatalog,
  educationCatalog,
  neighborhoodTemplate,
  vehicleCatalog,
} from "./contracts.mjs";

function send(res, status, body) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
  });
  res.end(JSON.stringify(body));
}

export function makeServer() {
  return createServer((req, res) => {
    const path = (req.url || "").split("?")[0];

    if (req.method === "GET" && path === "/health") {
      return send(res, 200, {
        ok: true,
        service: "afrilife-api",
        productionReady: false,
      });
    }

    if (req.method === "GET" && path === "/v1/status") {
      return send(res, 200, {
        project: "AfriLife",
        stage: "core-neighborhood-foundation",
        productionReady: false,
        persistentOnlineWorld: "not-implemented",
        economySimulation: "prototype-contracts",
        banking: "client-foundation",
        education: "client-foundation",
        persistentNpcs: "client-foundation",
        vehicles: "client-foundation",
        targets: platformTargets.targets.map(target => target.id),
      });
    }

    if (req.method === "GET" && path === "/v1/cities") return send(res, 200, cityCatalog);
    if (req.method === "GET" && path === "/v1/systems") return send(res, 200, systemRegistry);
    if (req.method === "GET" && path === "/v1/platforms") return send(res, 200, platformTargets);
    if (req.method === "GET" && path === "/v1/milestones/daily-life") return send(res, 200, dailyLifeLoop);
    if (req.method === "GET" && path === "/v1/jobs") return send(res, 200, jobsCatalog);
    if (req.method === "GET" && path === "/v1/shop") return send(res, 200, shopCatalog);
    if (req.method === "GET" && path === "/v1/bill-types") return send(res, 200, billTypes);
    if (req.method === "GET" && path === "/v1/banks") return send(res, 200, bankCatalog);
    if (req.method === "GET" && path === "/v1/education") return send(res, 200, educationCatalog);
    if (req.method === "GET" && path === "/v1/neighborhood-template") return send(res, 200, neighborhoodTemplate);
    if (req.method === "GET" && path === "/v1/vehicles") return send(res, 200, vehicleCatalog);

    return send(res, 404, { error: "not_found" });
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const port = Number.parseInt(process.env.PORT || "4200", 10);
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error("Invalid PORT");

  makeServer().listen(port, "127.0.0.1", () => {
    console.log(`AfriLife local API: http://127.0.0.1:${port}`);
  });
}
