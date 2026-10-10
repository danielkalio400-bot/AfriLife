import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { sendJson } from "./http/json.mjs";
import { handleWorldReference } from "./routes/world-reference.mjs";
import { handleRuntimeContracts } from "./routes/runtime-contracts.mjs";
import { handleOperationsContracts } from "./routes/operations-contracts.mjs";
import { handleSimulationContracts } from "./routes/simulation-contracts.mjs";
import { handleEnergyContracts } from "./routes/energy-contracts.mjs";
import { handleCommerce } from "./routes/commerce.mjs";
import { MarketplaceService } from "./services/marketplace.mjs";
import { BusinessOwnershipService } from "./services/business-ownership.mjs";
import {
  marketplaceRuntime,
  businessOwnershipRuntime,
} from "./commerce-contracts.mjs";
import {
  backupEnergyRuntime,
  fuelEconomyRuntime,
  telecomBillingRuntime,
  maintenanceBusinessRuntime,
} from "./energy-contracts.mjs";
import {
  trafficAgents,
  utilityBilling,
  transitPassengers,
  businessRuntime,
} from "./simulation-contracts.mjs";
import {
  roadEvents,
  telecomOperations,
  powerRestoration,
  neighborhoodServiceOperations,
} from "./operations-contracts.mjs";
import {
  cityRuntimeProfiles,
  neighborhoodRuntime,
  publicTransitRuntime,
} from "./runtime-contracts.mjs";
import {
  nigeriaReference,
  ghanaReference,
  crossBorderReference,
  researchSources,
} from "./world-reference.mjs";
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

export function makeServer() {
  const marketplace = new MarketplaceService();
  const businesses = new BusinessOwnershipService();

  return createServer(async (req, res) => {
    const path = (req.url || "").split("?")[0];

    if (req.method === "GET" && path === "/health") {
      return sendJson(res, 200, {
        ok: true,
        service: "afrilife-api",
        productionReady: false,
      });
    }

    if (req.method === "GET" && path === "/v1/status") {
      return sendJson(res, 200, {
        project: "AfriLife",
        stage: "core-neighborhood-foundation",
        productionReady: false,
        persistentOnlineWorld: "not-implemented",
        economySimulation: "prototype-contracts",
        banking: "client-foundation",
        education: "client-foundation",
        persistentNpcs: "client-foundation",
        vehicles: "client-foundation",
        firstNeighborhoodRuntime: "client-foundation",
        publicTransitRuntime: "contract-foundation",
        utilityInterdependence: "client-foundation",
        roadOperations: "client-foundation",
        transitOperations: "client-foundation",
        telecomOperations: "client-foundation",
        powerRestoration: "client-foundation",
        trafficAgents: "client-foundation",
        utilityBilling: "client-foundation",
        transitPassengers: "client-foundation",
        neighborhoodBusinesses: "client-foundation",
        persistentWorldEvents: "client-foundation",
        backupEnergy: "client-foundation",
        fuelEconomy: "client-foundation",
        telecomBilling: "client-foundation",
        maintenanceServices: "client-foundation",
        marketplace: "local-in-memory-prototype",
        businessOwnership: "local-in-memory-prototype",
        targets: platformTargets.targets.map(target => target.id),
      });
    }

    if (req.method === "GET" && path === "/v1/cities") return sendJson(res, 200, cityCatalog);
    if (req.method === "GET" && path === "/v1/systems") return sendJson(res, 200, systemRegistry);
    if (req.method === "GET" && path === "/v1/platforms") return sendJson(res, 200, platformTargets);
    if (req.method === "GET" && path === "/v1/milestones/daily-life") return sendJson(res, 200, dailyLifeLoop);
    if (req.method === "GET" && path === "/v1/jobs") return sendJson(res, 200, jobsCatalog);
    if (req.method === "GET" && path === "/v1/shop") return sendJson(res, 200, shopCatalog);
    if (req.method === "GET" && path === "/v1/bill-types") return sendJson(res, 200, billTypes);
    if (req.method === "GET" && path === "/v1/banks") return sendJson(res, 200, bankCatalog);
    if (req.method === "GET" && path === "/v1/education") return sendJson(res, 200, educationCatalog);
    if (req.method === "GET" && path === "/v1/neighborhood-template") return sendJson(res, 200, neighborhoodTemplate);
    if (req.method === "GET" && path === "/v1/vehicles") return sendJson(res, 200, vehicleCatalog);

    if (handleWorldReference(req, res, path, {
      nigeria: nigeriaReference,
      ghana: ghanaReference,
      crossBorder: crossBorderReference,
      sources: researchSources,
    })) return;

    if (handleRuntimeContracts(req, res, path, {
      cities: cityRuntimeProfiles,
      neighborhood: neighborhoodRuntime,
      transit: publicTransitRuntime,
    })) return;

    if (handleOperationsContracts(req, res, path, {
      roads: roadEvents,
      telecom: telecomOperations,
      power: powerRestoration,
      services: neighborhoodServiceOperations,
    })) return;

    if (handleSimulationContracts(req, res, path, {
      traffic: trafficAgents,
      utilities: utilityBilling,
      transit: transitPassengers,
      businesses: businessRuntime,
    })) return;

    if (handleEnergyContracts(req, res, path, {
      backup: backupEnergyRuntime,
      fuel: fuelEconomyRuntime,
      telecom: telecomBillingRuntime,
      maintenance: maintenanceBusinessRuntime,
    })) return;

    if (await handleCommerce(req, res, path, {
      marketplace,
      businesses,
      contracts: {
        marketplace: marketplaceRuntime,
        businesses: businessOwnershipRuntime,
      },
    })) return;

    return sendJson(res, 404, { error: "not_found" });
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
