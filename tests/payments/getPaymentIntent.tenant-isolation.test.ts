import { describe, expect, it, mock } from "bun:test";

const findFirstMock = mock();

mock.module("~/server/lib/prisma", () => ({
  prisma: {
    paymentIntent: {
      findFirst: findFirstMock,
    },
  },
}));

const { getPaymentIntent } =
  await import("~/server/services/payments/getPaymentIntent");

describe("getPaymentIntent tenant isolation", () => {
  it("filters by tenantId and merchantAccountId when merchant-scoped API key is used", async () => {
    findFirstMock.mockReset();
    findFirstMock.mockResolvedValue({
      publicId: "piq_123",
      status: "AWAITING_CUSTOMER",
      amount: { toString: () => "20.00" },
      currency: "THB",
      events: [],
    });

    await getPaymentIntent(
      {
        apiKeyId: "key_1",
        apiKeyPrefix: "pk_test_xxx",
        tenantId: "tenant_1",
        tenantCode: "demo",
        merchantAccountId: "merchant_1",
        merchantCode: "default",
        scopes: ["payments:read"],
      },
      "piq_123",
    );

    expect(findFirstMock).toHaveBeenCalledTimes(1);
    expect(findFirstMock.mock.calls[0]?.[0]?.where).toEqual({
      publicId: "piq_123",
      tenantId: "tenant_1",
      merchantAccountId: "merchant_1",
    });
  });

  it("filters only by tenantId when auth is tenant-wide", async () => {
    findFirstMock.mockReset();
    findFirstMock.mockResolvedValue({
      publicId: "piq_456",
      status: "AWAITING_CUSTOMER",
      amount: { toString: () => "30.00" },
      currency: "THB",
      events: [],
    });

    await getPaymentIntent(
      {
        apiKeyId: "key_2",
        apiKeyPrefix: "pk_test_yyy",
        tenantId: "tenant_1",
        tenantCode: "demo",
        merchantAccountId: null,
        merchantCode: null,
        scopes: ["payments:read"],
      },
      "piq_456",
    );

    expect(findFirstMock).toHaveBeenCalledTimes(1);
    expect(findFirstMock.mock.calls[0]?.[0]?.where).toEqual({
      publicId: "piq_456",
      tenantId: "tenant_1",
    });
  });
});
