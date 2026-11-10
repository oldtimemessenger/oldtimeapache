import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = path => readFileSync(new URL(path, import.meta.url), "utf8");

test("web checkout and third-party billing runtime stay removed while Apple IAP uses Cloudflare", () => {
  for (const file of [
    "../src/routes/memberships.ts", "../src/lib/membership-stripe.ts",
    "../scripts/seed-membership-prices.mjs", "../scripts/seed-membership-prices-live.mjs"
  ]) assert.equal(existsSync(new URL(file, import.meta.url)), false, file);
  const runtime = read("../src/cloudflare/worker.ts") + read("../scripts/cloudflare-preview-gateway.mjs");
  assert.doesNotMatch(runtime, /stripe|revenuecat|createCheckoutSession|grantMembership/i);
  assert.match(runtime, /apple\/notifications/i);
  assert.doesNotMatch(runtime, /privateKey|notificationSecret|issuerId|keyId/);
  assert.match(read("../src/cloudflare/apple-billing.ts"), /verifyAndDecodeTransaction/);
  const pkg = JSON.parse(read("../package.json"));
  assert.equal(pkg.dependencies.stripe, undefined);
  assert.equal(pkg.dependencies["@replit/revenuecat-sdk"], undefined);
  assert.doesNotMatch(JSON.stringify(pkg.scripts), /membership|stripe/i);
});

test("API contract exposes Apple transaction verification, not third-party billing or web checkout", () => {
  const spec = read("../../../lib/api-spec/openapi.yaml");
  assert.doesNotMatch(spec, /RevenueCat|\/memberships|\/stripe|MembershipTier|StripeWebhook|CheckoutUrl|\/badge\/checkout/);
  assert.match(spec, /\/badge\/purchase-context:/);
  assert.match(spec, /\/badge\/apple\/verify:/);
  assert.match(spec, /\/apple\/notifications:/);
  assert.match(spec, /signedTransactionInfo/);
  for (const path of ["/auth/register:", "/auth/login:", "/posts:", "/feed:", "/healthz:"]) {
    assert.ok(spec.includes(path), `${path} must remain`);
  }
});
