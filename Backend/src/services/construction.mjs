import { randomUUID } from "node:crypto";

const PHASES = [
  "planning",
  "site-preparation",
  "foundation",
  "structure",
  "roofing",
  "utilities",
  "interior",
  "exterior",
  "inspection",
  "completed",
];

export class ConstructionService {
  #projects = new Map();
  #designs = new Map();

  createProject(input) {
    const propertyId = String(input?.propertyId || "").trim();
    const ownerEntityId = String(input?.ownerEntityId || "").trim();
    if (!propertyId || !ownerEntityId)
      return { ok: false, error: "invalid_construction_project" };

    const project = {
      projectId: randomUUID(),
      propertyId,
      ownerEntityId,
      contractorBusinessId: String(input?.contractorBusinessId || "").trim(),
      phase: "planning",
      phaseProgress01: 0,
      currency: String(input?.currency || "NGN"),
      budgetMinorUnits: Math.max(0, Math.trunc(Number(input?.budgetMinorUnits) || 0)),
      spentMinorUnits: 0,
      workers: [],
      materials: [],
    };
    this.#projects.set(project.projectId, project);
    return { ok: true, project: structuredClone(project) };
  }

  assignWorker(projectId, input) {
    const project = this.#projects.get(projectId);
    if (!project) return { ok: false, error: "construction_project_not_found" };
    const npcId = String(input?.npcId || "").trim();
    if (!npcId) return { ok: false, error: "invalid_worker" };

    project.workers.push({
      npcId,
      role: String(input?.role || "general-worker"),
      skill01: Math.max(0, Math.min(1, Number(input?.skill01) || 0.5)),
      active: true,
    });
    return { ok: true, project: structuredClone(project) };
  }

  addMaterial(projectId, input) {
    const project = this.#projects.get(projectId);
    if (!project) return { ok: false, error: "construction_project_not_found" };
    const materialId = String(input?.materialId || "").trim();
    const requiredUnits = Math.max(0, Number(input?.requiredUnits) || 0);
    if (!materialId || requiredUnits <= 0)
      return { ok: false, error: "invalid_material_requirement" };

    project.materials.push({
      materialId,
      requiredUnits,
      deliveredUnits: Math.min(requiredUnits, Math.max(0, Number(input?.deliveredUnits) || 0)),
      unitCostMinorUnits: Math.max(0, Math.trunc(Number(input?.unitCostMinorUnits) || 0)),
    });
    return { ok: true, project: structuredClone(project) };
  }

  advance(projectId, gameHours) {
    const project = this.#projects.get(projectId);
    if (!project) return { ok: false, error: "construction_project_not_found" };
    if (project.phase === "completed") return { ok: true, project: structuredClone(project) };

    if (project.materials.some(material => material.deliveredUnits < material.requiredUnits))
      return { ok: false, error: "construction_materials_missing" };

    const workers = project.workers.filter(worker => worker.active);
    if (workers.length === 0) return { ok: false, error: "construction_workers_missing" };

    const averageSkill = workers.reduce((sum, worker) => sum + Math.max(0.1, worker.skill01), 0) / workers.length;
    project.phaseProgress01 = Math.min(
      1,
      project.phaseProgress01 + Math.max(0, Number(gameHours) || 0) * 0.02 * averageSkill * Math.sqrt(workers.length)
    );

    if (project.phaseProgress01 >= 1) {
      const index = PHASES.indexOf(project.phase);
      project.phase = PHASES[Math.min(PHASES.length - 1, index + 1)];
      project.phaseProgress01 = 0;
    }

    return { ok: true, project: structuredClone(project) };
  }

  proposeHouseDesign(input) {
    const requestId = String(input?.requestId || randomUUID());
    const floorArea = Math.max(1, Number(input?.maximumFloorAreaSquareMeters) || 100);
    const bedrooms = Math.max(0, Math.min(20, Math.trunc(Number(input?.bedroomCount) || 2)));
    const bathrooms = Math.max(0, Math.min(20, Math.trunc(Number(input?.bathroomCount) || 1)));
    const floors = Math.max(1, Math.min(10, Math.trunc(Number(input?.floorCount) || 1)));
    const budget = Math.max(0, Math.trunc(Number(input?.budgetMinorUnits) || 0));

    const proposal = {
      proposalId: randomUUID(),
      requestId,
      estimatedFloorAreaSquareMeters: Math.min(floorArea, Math.max(35, bedrooms * 22 + bathrooms * 8 + floors * 18)),
      estimatedCostMinorUnits: budget > 0 ? Math.round(budget * 0.88) : 0,
      roomTags: [
        ...Array.from({ length: bedrooms }, (_, index) => `bedroom-${index + 1}`),
        ...Array.from({ length: bathrooms }, (_, index) => `bathroom-${index + 1}`),
        "living-area",
        "kitchen",
      ],
      notes: ["in-game-concept-only", "requires-professional-review"],
      requiresProfessionalReview: true,
    };
    this.#designs.set(proposal.proposalId, proposal);
    return { ok: true, proposal: { ...proposal } };
  }
}
