import assert from "node:assert/strict";
import test from "node:test";
import {
  appleServerNotification,
  deriveAppleSubscriptionState,
  verifyApplePurchase,
} from "../src/cloudflare/apple-billing";

function databaseFor() {
  const writes: string[] = [];
  return {
    writes,
    prepare(sql: string) {
      return {
        bind() { return this; },
        async first() { return null; },
        async all() { return { success: true, results: [] }; },
        async run() { writes.push(sql); return { success: true }; },
      };
    },
    async batch(statements: Array<{ sql?: string }>) {
      writes.push(...statements.map(statement => statement.sql ?? "entitlement write"));
      return statements.map(() => ({ success: true }));
    },
  };
}

const enabledConfig = { enabled: "true", appId: "1234567890" };

test("Apple entitlement state follows expiry, grace, cancellation, and revocation", () => {
  const now = 2_000_000;
  const future = { expiresDate: now + 60_000 };
  assert.equal(deriveAppleSubscriptionState(future, null, now).state, "active");
  assert.equal(
    deriveAppleSubscriptionState(future, { autoRenewStatus: 0 }, now).state,
    "canceled",
  );
  assert.equal(
    deriveAppleSubscriptionState(
      { expiresDate: now - 60_000 },
      { gracePeriodExpiresDate: now + 60_000 },
      now,
    ).state,
    "active",
  );
  assert.equal(
    deriveAppleSubscriptionState(
      { expiresDate: now - 60_000 },
      { expirationIntent: 1 },
      now,
    ).state,
    "billing-issue",
  );
  assert.equal(
    deriveAppleSubscriptionState(
      { ...future, revocationDate: now - 1 },
      null,
      now,
    ).state,
    "revoked",
  );
});

test("StoreKit verification rejects an unsigned or malformed transaction before any write", async () => {
  const db = databaseFor();
  await assert.rejects(
    verifyApplePurchase(
      new Request("https://example.test/api/badge/apple/verify", {
        method: "POST",
        body: JSON.stringify({ signedTransactionInfo: "eyJhbGciOiJFUzI1NiJ9.eyJwcm9kdWN0SWQiOiJjb20ub2xkdGltZS5tZXNzZW5nZXIuYmx1ZWJiYWRnZSJ9.invalid" }),
        headers: { "content-type": "application/json" },
      }),
      db as never,
      "member-1",
      enabledConfig,
    ),
    /signed transaction could not be verified/,
  );
  assert.equal(db.writes.length, 0);
});

test("StoreKit verification stays disabled until the public Apple app ID and flag are set", async () => {
  const db = databaseFor();
  await assert.rejects(
    verifyApplePurchase(
      new Request("https://example.test/api/badge/apple/verify", {
        method: "POST",
        body: JSON.stringify({ signedTransactionInfo: "not-a-jws" }),
      }),
      db as never,
      "member-1",
      {},
    ),
    /not configured/,
  );
  await assert.rejects(
    verifyApplePurchase(
      new Request("https://example.test/api/badge/apple/verify", {
        method: "POST",
        body: JSON.stringify({ signedTransactionInfo: "not-a-jws" }),
      }),
      db as never,
      "member-1",
      { enabled: "true" },
    ),
    /not configured/,
  );
  assert.equal(db.writes.length, 0);
});

test("App Store notifications verify their signed payload instead of requiring a shared secret", async () => {
  const db = databaseFor();
  const response = await appleServerNotification(
    new Request("https://example.test/api/apple/notifications?key=ignored", {
      method: "POST",
      body: JSON.stringify({ signedPayload: "eyJhbGciOiJFUzI1NiJ9.eyJub3RpZmljYXRpb25UeXBlIjoiVEVTVCJ9.invalid" }),
      headers: { "content-type": "application/json" },
    }),
    db as never,
    enabledConfig,
  );
  assert.equal(response.status, 422);
  assert.equal(db.writes.length, 0);
});

test("App Store notification endpoint rejects malformed bodies without writing", async () => {
  const db = databaseFor();
  const response = await appleServerNotification(
    new Request("https://example.test/api/apple/notifications", {
      method: "POST",
      body: JSON.stringify({ notificationType: "TEST" }),
      headers: { "content-type": "application/json" },
    }),
    db as never,
    enabledConfig,
  );
  assert.equal(response.status, 400);
  assert.equal(db.writes.length, 0);
});
