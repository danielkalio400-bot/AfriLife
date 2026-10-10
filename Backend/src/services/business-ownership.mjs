import { randomUUID } from "node:crypto";

export class BusinessOwnershipService {
  #businesses = new Map();
  #employees = new Map();
  #suppliers = new Map();

  register(input) {
    const legalName = String(input?.legalName || "").trim().slice(0, 120);
    const ownerEntityId = String(input?.ownerEntityId || "").trim();
    const countryId = String(input?.countryId || "").trim();
    const type = String(input?.type || "").trim();
    if (!legalName || !ownerEntityId || !countryId || !type)
      return { ok: false, error: "invalid_business" };

    const business = {
      businessId: randomUUID(),
      legalName,
      ownerEntityId,
      countryId,
      type,
      cashMinorUnits: Math.max(0, Math.trunc(Number(input?.cashMinorUnits) || 0)),
      reputation01: 0.5,
      registered: true,
      branchIds: [],
      createdAt: new Date().toISOString(),
    };

    this.#businesses.set(business.businessId, business);
    return { ok: true, business: { ...business } };
  }

  get(businessId) {
    const business = this.#businesses.get(businessId);
    return business ? { ...business } : null;
  }

  hire(businessId, input) {
    if (!this.#businesses.has(businessId)) return { ok: false, error: "business_not_found" };
    const employeeNpcId = String(input?.employeeNpcId || "").trim();
    if (!employeeNpcId) return { ok: false, error: "invalid_employee" };

    const key = `${businessId}:${employeeNpcId}`;
    const record = {
      businessId,
      employeeNpcId,
      roleId: String(input?.roleId || "staff").trim(),
      salaryPerPeriodMinorUnits: Math.max(0, Math.trunc(Number(input?.salaryPerPeriodMinorUnits) || 0)),
      active: true,
    };
    this.#employees.set(key, record);
    return { ok: true, employee: { ...record } };
  }

  addSupplier(businessId, input) {
    if (!this.#businesses.has(businessId)) return { ok: false, error: "business_not_found" };
    const supplierBusinessId = String(input?.supplierBusinessId || "").trim();
    const productId = String(input?.productId || "").trim();
    if (!supplierBusinessId || !productId) return { ok: false, error: "invalid_supplier_contract" };

    const contract = {
      contractId: randomUUID(),
      businessId,
      supplierBusinessId,
      productId,
      unitCostMinorUnits: Math.max(0, Math.trunc(Number(input?.unitCostMinorUnits) || 0)),
      quantityPerDelivery: Math.max(1, Math.trunc(Number(input?.quantityPerDelivery) || 1)),
      deliveryIntervalDays: Math.max(1, Math.trunc(Number(input?.deliveryIntervalDays) || 7)),
      active: true,
    };
    this.#suppliers.set(contract.contractId, contract);
    return { ok: true, contract: { ...contract } };
  }

  applyPeriod(businessId, period) {
    const business = this.#businesses.get(businessId);
    if (!business) return { ok: false, error: "business_not_found" };

    const revenue = Math.max(0, Math.trunc(Number(period?.revenueMinorUnits) || 0));
    const costs = [
      "costOfGoodsMinorUnits",
      "salariesMinorUnits",
      "rentMinorUnits",
      "utilitiesMinorUnits",
      "otherCostsMinorUnits",
    ].reduce((sum, key) => sum + Math.max(0, Math.trunc(Number(period?.[key]) || 0)), 0);

    const profitLossMinorUnits = revenue - costs;
    business.cashMinorUnits = Math.max(0, business.cashMinorUnits + profitLossMinorUnits);

    return {
      ok: true,
      period: { revenueMinorUnits: revenue, totalCostsMinorUnits: costs, profitLossMinorUnits },
      business: { ...business },
    };
  }
}
