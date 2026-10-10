import { randomUUID } from "node:crypto";

export class MarketplaceService {
  #sellers = new Map();
  #listings = new Map();
  #orders = new Map();
  #disputes = new Map();

  registerSeller(input) {
    const sellerId = String(input?.sellerId || randomUUID());
    const seller = {
      sellerId,
      displayName: String(input?.displayName || "").trim().slice(0, 80),
      countryId: String(input?.countryId || "").trim(),
      businessId: String(input?.businessId || "").trim(),
      reputation01: Math.max(0, Math.min(1, Number(input?.reputation01) || 0.5)),
      completedOrders: 0,
      active: true,
    };
    if (!seller.displayName || !seller.countryId)
      return { ok: false, error: "invalid_seller" };
    this.#sellers.set(sellerId, seller);
    return { ok: true, seller: { ...seller } };
  }

  createListing(input) {
    const seller = this.#sellers.get(String(input?.sellerId || ""));
    if (!seller || !seller.active) return { ok: false, error: "seller_not_available" };

    const listing = {
      listingId: randomUUID(),
      sellerId: seller.sellerId,
      productId: String(input?.productId || "").trim(),
      title: String(input?.title || "").trim().slice(0, 120),
      currency: String(input?.currency || "").trim(),
      unitPriceMinorUnits: Math.max(0, Math.trunc(Number(input?.unitPriceMinorUnits) || 0)),
      availableQuantity: Math.max(0, Math.trunc(Number(input?.availableQuantity) || 0)),
      warehouseId: String(input?.warehouseId || "").trim(),
      active: true,
    };

    if (!listing.productId || !listing.title || !listing.currency || listing.availableQuantity < 1)
      return { ok: false, error: "invalid_listing" };

    this.#listings.set(listing.listingId, listing);
    return { ok: true, listing: { ...listing } };
  }

  search(query = "") {
    const term = String(query).trim().toLowerCase();
    return [...this.#listings.values()]
      .filter(listing => listing.active && (!term ||
        listing.title.toLowerCase().includes(term) ||
        listing.productId.toLowerCase().includes(term)))
      .map(listing => ({ ...listing }));
  }

  checkout(input) {
    const listing = this.#listings.get(String(input?.listingId || ""));
    const quantity = Math.max(1, Math.trunc(Number(input?.quantity) || 1));
    if (!listing || !listing.active) return { ok: false, error: "listing_not_found" };
    if (listing.availableQuantity < quantity) return { ok: false, error: "insufficient_stock" };

    const totalMinorUnits = listing.unitPriceMinorUnits * quantity;
    listing.availableQuantity -= quantity;
    if (listing.availableQuantity === 0) listing.active = false;

    const order = {
      orderId: randomUUID(),
      buyerEntityId: String(input?.buyerEntityId || "").trim(),
      sellerId: listing.sellerId,
      listingId: listing.listingId,
      quantity,
      currency: listing.currency,
      totalMinorUnits,
      state: "paid",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (!order.buyerEntityId) return { ok: false, error: "invalid_buyer" };

    this.#orders.set(order.orderId, order);
    return { ok: true, order: { ...order } };
  }

  updateOrder(orderId, state) {
    const order = this.#orders.get(orderId);
    if (!order) return { ok: false, error: "order_not_found" };
    const allowed = new Set(["paid", "preparing", "in-transit", "delivered", "return-requested", "refunded", "cancelled", "disputed"]);
    if (!allowed.has(state)) return { ok: false, error: "invalid_order_state" };
    order.state = state;
    order.updatedAt = new Date().toISOString();

    if (state === "delivered") {
      const seller = this.#sellers.get(order.sellerId);
      if (seller) seller.completedOrders++;
    }
    return { ok: true, order: { ...order } };
  }

  openDispute(input) {
    const order = this.#orders.get(String(input?.orderId || ""));
    if (!order) return { ok: false, error: "order_not_found" };

    const dispute = {
      disputeId: randomUUID(),
      orderId: order.orderId,
      buyerEntityId: order.buyerEntityId,
      sellerId: order.sellerId,
      reasonCode: String(input?.reasonCode || "other").slice(0, 64),
      state: "open",
      openedAt: new Date().toISOString(),
    };
    order.state = "disputed";
    this.#disputes.set(dispute.disputeId, dispute);
    return { ok: true, dispute: { ...dispute } };
  }
}
