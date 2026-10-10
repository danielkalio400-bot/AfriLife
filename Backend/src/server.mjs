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
import { handleProperty } from "./routes/property.mjs";
import { RealEstateService } from "./services/real-estate.mjs";
import { ConstructionService } from "./services/construction.mjs";
import { handleHealthcare } from "./routes/healthcare.mjs";
import { HealthcareService } from "./services/healthcare.mjs";
import { healthcareRuntime } from "./health-contracts.mjs";
import { handleEmergency } from "./routes/emergency.mjs";
import { EmergencyDispatchService } from "./services/emergency-dispatch.mjs";
import { emergencyServicesRuntime } from "./emergency-contracts.mjs";
import { handlePropertyIncidents } from "./routes/property-incidents.mjs";
import { PropertyIncidentService } from "./services/property-incident.mjs";
import { propertyTheftRecoveryRuntime } from "./property-crime-contracts.mjs";
import { handleJusticeInvestigations } from "./routes/justice-investigations.mjs";
import { JusticeInvestigationService } from "./services/justice-investigations.mjs";
import { policeInvestigationFinancialCrimeRuntime } from "./justice-contracts.mjs";
import { handleCourts } from "./routes/courts.mjs";
import { CourtService } from "./services/courts.mjs";
import { courtJusticeRuntime } from "./court-contracts.mjs";
import { handleCorrections } from "./routes/corrections.mjs";
import { CorrectionsService } from "./services/corrections.mjs";
import { prisonRuntime } from "./prison-contracts.mjs";
import { handleImmigration } from "./routes/immigration.mjs";
import { ImmigrationService } from "./services/immigration.mjs";
import { immigrationRuntime } from "./immigration-contracts.mjs";
import { handleAviation } from "./routes/aviation.mjs";
import { AviationService } from "./services/aviation.mjs";
import { aviationRuntime } from "./aviation-contracts.mjs";
import { handleMaritime } from "./routes/maritime.mjs";
import { MaritimeService } from "./services/maritime.mjs";
import { maritimeRuntime } from "./maritime-contracts.mjs";
import { handleRail } from "./routes/rail.mjs";
import { RailService } from "./services/rail.mjs";
import { railRuntime } from "./rail-contracts.mjs";
import { handleLogistics } from "./routes/logistics.mjs";
import { LogisticsService } from "./services/logistics.mjs";
import { logisticsRuntime } from "./logistics-contracts.mjs";
import { handleGovernment } from "./routes/government.mjs";
import { GovernmentService } from "./services/government.mjs";
import { governmentRuntime } from "./government-contracts.mjs";
import { handleCentralBankEconomy } from "./routes/central-bank-economy.mjs";
import { CentralBankEconomyService } from "./services/central-bank-economy.mjs";
import { centralBankEconomyRuntime } from "./central-bank-contracts.mjs";
import { handleNationalRevenueDividend } from "./routes/national-revenue-dividend.mjs";
import { NationalRevenueDividendService } from "./services/national-revenue-dividend.mjs";
import { nationalRevenueDividendRuntime } from "./national-revenue-contracts.mjs";
import { realEstateRuntime, constructionRuntime } from "./property-contracts.mjs";
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
  const realEstate = new RealEstateService();
  const construction = new ConstructionService();
  const healthcare = new HealthcareService();
  const emergency = new EmergencyDispatchService();
  const propertyIncidents = new PropertyIncidentService();
  const justiceInvestigations = new JusticeInvestigationService();
  const courts = new CourtService();
  const corrections = new CorrectionsService();
  const immigration = new ImmigrationService();
  const aviation = new AviationService();
  const maritime = new MaritimeService();
  const rail = new RailService();
  const logistics = new LogisticsService();
  const government = new GovernmentService();
  const centralBankEconomy = new CentralBankEconomyService();
  const nationalRevenueDividend = new NationalRevenueDividendService();

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
        realEstate: "local-in-memory-prototype",
        construction: "local-in-memory-prototype",
        healthcare: "local-high-level-prototype",
        emergencyServices: "local-dispatch-prototype",
        propertyTheftRecovery: "local-reporting-recovery-prototype",
        policeCidFinancialCrime: "local-lawful-process-prototype",
        courtJustice: "local-fictional-justice-prototype",
        prisonSystem: "local-non-graphic-corrections-prototype",
        immigrationPassportVisa: "local-fictional-administration-prototype",
        airportsAviation: "local-high-level-transport-prototype",
        maritimeTransport: "local-high-level-transport-economy-prototype",
        railSystem: "local-high-level-transport-economy-prototype",
        logisticsSupplyChains: "local-high-level-economy-prototype",
        government: "local-fictional-neutral-simulation-prototype",
        centralBankEconomy: "local-fictional-macro-state-prototype",
        nationalRevenueDividend: "local-fictional-public-finance-prototype",
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

    if (await handleProperty(req, res, path, {
      realEstate,
      construction,
      contracts: {
        realEstate: realEstateRuntime,
        construction: constructionRuntime,
      },
    })) return;

    if (await handleHealthcare(req, res, path, {
      healthcare,
      contract: healthcareRuntime,
    })) return;

    if (await handleEmergency(req, res, path, {
      emergency,
      contract: emergencyServicesRuntime,
    })) return;

    if (await handlePropertyIncidents(req, res, path, {
      incidents: propertyIncidents,
      contract: propertyTheftRecoveryRuntime,
    })) return;

    if (await handleJusticeInvestigations(req, res, path, {
      justice: justiceInvestigations,
      contract: policeInvestigationFinancialCrimeRuntime,
    })) return;

    if (await handleCourts(req, res, path, {
      courts,
      contract: courtJusticeRuntime,
    })) return;

    if (await handleCorrections(req, res, path, {
      corrections,
      contract: prisonRuntime,
    })) return;

    if (await handleImmigration(req, res, path, {
      immigration,
      contract: immigrationRuntime,
    })) return;

    if (await handleAviation(req, res, path, {
      aviation,
      contract: aviationRuntime,
    })) return;

    if (await handleMaritime(req, res, path, {
      maritime,
      contract: maritimeRuntime,
    })) return;

    if (await handleRail(req, res, path, {
      rail,
      contract: railRuntime,
    })) return;

    if (await handleLogistics(req, res, path, {
      logistics,
      contract: logisticsRuntime,
    })) return;

    if (await handleGovernment(req, res, path, {
      government,
      contract: governmentRuntime,
    })) return;

    if (await handleCentralBankEconomy(req, res, path, {
      economy: centralBankEconomy,
      contract: centralBankEconomyRuntime,
    })) return;

    if (await handleNationalRevenueDividend(req, res, path, {
      finance: nationalRevenueDividend,
      contract: nationalRevenueDividendRuntime,
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
