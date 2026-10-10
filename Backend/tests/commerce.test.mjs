import test from "node:test";
import assert from "node:assert/strict";
import { MarketplaceService } from "../src/services/marketplace.mjs";
import { BusinessOwnershipService } from "../src/services/business-ownership.mjs";
import { marketplaceRuntime, businessOwnershipRuntime } from "../src/commerce-contracts.mjs";

test("marketplace contracts cover sellers, warehouses, deliveries and disputes", () => {
  assert.ok(marketplaceRuntime.systems.includes("sellers"));
  assert.ok(marketplaceRuntime.systems.includes("warehouses"));
  assert.ok(marketplaceRuntime.systems.includes("deliveries"));
  assert.ok(marketplaceRuntime.systems.includes("seller-disputes"));
});

test("marketplace seller can list, search, sell and open dispute", () => {
  const service = new MarketplaceService();
  const seller = service.registerSeller({
    displayName: "Example Seller",
    countryId: "Nigeria",
  });
  assert.equal(seller.ok, true);

  const listing = service.createListing({
    sellerId: seller.seller.sellerId,
    productId: "rice-001",
    title: "Rice",
    currency: "NGN",
    unitPriceMinorUnits: 10000,
    availableQuantity: 5,
  });
  assert.equal(listing.ok, true);
  assert.equal(service.search("rice").length, 1);

  const order = service.checkout({
    listingId: listing.listing.listingId,
    buyerEntityId: "buyer-1",
    quantity: 2,
  });
  assert.equal(order.ok, true);
  assert.equal(order.order.totalMinorUnits, 20000);

  const dispute = service.openDispute({
    orderId: order.order.orderId,
    reasonCode: "delivery-problem",
  });
  assert.equal(dispute.ok, true);
});

test("business ownership supports staff, suppliers and profit/loss period", () => {
  const service = new BusinessOwnershipService();
  const created = service.register({
    legalName: "Example Foods",
    ownerEntityId: "owner-1",
    countryId: "Ghana",
    type: "retail",
    cashMinorUnits: 500000,
  });
  assert.equal(created.ok, true);

  assert.equal(service.hire(created.business.businessId, {
    employeeNpcId: "npc-1",
    roleId: "cashier",
    salaryPerPeriodMinorUnits: 50000,
  }).ok, true);

  assert.equal(service.addSupplier(created.business.businessId, {
    supplierBusinessId: "supplier-1",
    productId: "food-1",
    unitCostMinorUnits: 1000,
    quantityPerDelivery: 50,
  }).ok, true);

  const period = service.applyPeriod(created.business.businessId, {
    revenueMinorUnits: 200000,
    salariesMinorUnits: 50000,
    utilitiesMinorUnits: 10000,
    costOfGoodsMinorUnits: 60000,
  });
  assert.equal(period.ok, true);
  assert.equal(period.period.profitLossMinorUnits, 80000);
});

test("business contract includes profit, branches, expansion and reputation", () => {
  assert.ok(businessOwnershipRuntime.systems.includes("profit-loss"));
  assert.ok(businessOwnershipRuntime.systems.includes("branches"));
  assert.ok(businessOwnershipRuntime.systems.includes("expansion"));
  assert.ok(businessOwnershipRuntime.systems.includes("reputation"));
});
