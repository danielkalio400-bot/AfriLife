import { randomUUID } from "node:crypto";

export class RealEstateService {
  #properties = new Map();
  #rentals = new Map();
  #mortgages = new Map();

  registerProperty(input) {
    const ownerEntityId = String(input?.ownerEntityId || "").trim();
    const countryId = String(input?.countryId || "").trim();
    const cityId = String(input?.cityId || "").trim();
    const type = String(input?.type || "").trim();
    if (!ownerEntityId || !countryId || !cityId || !type)
      return { ok: false, error: "invalid_property" };

    const property = {
      propertyId: randomUUID(),
      ownerEntityId,
      countryId,
      cityId,
      neighborhoodId: String(input?.neighborhoodId || "").trim(),
      type,
      currency: String(input?.currency || (countryId === "Ghana" ? "GHS" : "NGN")),
      purchasePriceMinorUnits: Math.max(0, Math.trunc(Number(input?.purchasePriceMinorUnits) || 0)),
      estimatedValueMinorUnits: Math.max(0, Math.trunc(Number(input?.estimatedValueMinorUnits) || 0)),
      occupied: Boolean(input?.occupied),
      forRent: Boolean(input?.forRent),
      forSale: Boolean(input?.forSale),
    };
    this.#properties.set(property.propertyId, property);
    return { ok: true, property: { ...property } };
  }

  get(propertyId) {
    const property = this.#properties.get(propertyId);
    return property ? { ...property } : null;
  }

  createRental(input) {
    const property = this.#properties.get(String(input?.propertyId || ""));
    if (!property) return { ok: false, error: "property_not_found" };

    const tenantEntityId = String(input?.tenantEntityId || "").trim();
    if (!tenantEntityId) return { ok: false, error: "invalid_tenant" };

    const agreement = {
      agreementId: randomUUID(),
      propertyId: property.propertyId,
      landlordEntityId: property.ownerEntityId,
      tenantEntityId,
      currency: property.currency,
      rentPerPeriodMinorUnits: Math.max(0, Math.trunc(Number(input?.rentPerPeriodMinorUnits) || 0)),
      periodDays: Math.max(1, Math.trunc(Number(input?.periodDays) || 30)),
      startsAt: String(input?.startsAt || new Date().toISOString()),
      endsAt: input?.endsAt ? String(input.endsAt) : null,
      active: true,
    };
    property.occupied = true;
    this.#rentals.set(agreement.agreementId, agreement);
    return { ok: true, agreement: { ...agreement } };
  }

  createMortgage(input) {
    const property = this.#properties.get(String(input?.propertyId || ""));
    if (!property) return { ok: false, error: "property_not_found" };

    const borrowerEntityId = String(input?.borrowerEntityId || "").trim();
    const bankId = String(input?.bankId || "").trim();
    const principal = Math.max(0, Math.trunc(Number(input?.principalMinorUnits) || 0));
    if (!borrowerEntityId || !bankId || principal <= 0)
      return { ok: false, error: "invalid_mortgage" };

    const mortgage = {
      mortgageId: randomUUID(),
      propertyId: property.propertyId,
      borrowerEntityId,
      bankId,
      currency: property.currency,
      principalMinorUnits: principal,
      outstandingMinorUnits: principal,
      termMonths: Math.max(1, Math.trunc(Number(input?.termMonths) || 120)),
      paymentsMade: 0,
      gameInterestRateAnnual01: Math.max(0, Math.min(1, Number(input?.gameInterestRateAnnual01) || 0)),
      active: true,
    };
    this.#mortgages.set(mortgage.mortgageId, mortgage);
    return { ok: true, mortgage: { ...mortgage } };
  }

  value(propertyId, input) {
    const property = this.#properties.get(propertyId);
    if (!property) return { ok: false, error: "property_not_found" };

    const base = Math.max(0, Math.trunc(Number(input?.baseValueMinorUnits) || property.estimatedValueMinorUnits || property.purchasePriceMinorUnits));
    const neighborhood = Math.max(0, Math.min(1, Number(input?.neighborhoodValueIndex01) || 0.5));
    const condition = Math.max(0, Math.min(1, Number(input?.condition01) || 1));
    const utility = Math.max(0, Math.min(1, Number(input?.utilityAccess01) || 1));
    const transport = Math.max(0, Math.min(1, Number(input?.transportAccess01) || 0.5));
    const services = Math.max(0, Math.min(1, Number(input?.serviceAccess01) || 0.5));

    const estimatedValueMinorUnits = Math.max(0, Math.round(
      base *
      (0.7 + neighborhood * 0.6) *
      (0.55 + condition * 0.45) *
      (0.5 + utility * 0.2 + transport * 0.15 + services * 0.15)
    ));
    property.estimatedValueMinorUnits = estimatedValueMinorUnits;
    return { ok: true, property: { ...property } };
  }
}
