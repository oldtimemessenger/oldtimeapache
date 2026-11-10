import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = path => readFileSync(new URL(path, import.meta.url), "utf8");

test("Cloudflare enables credential-free Apple signed-data verification", () => {
  const contract = read("../../../lib/api-spec/openapi.yaml");
  assert.doesNotMatch(contract, /\/badge\/(?:purchase|gift|redeem|checkout)(?:\/|\s|:)|\/memberships|\/stripe/);
  assert.match(contract, /\/badge\/purchase-context:/);
  assert.match(contract, /\/badge\/apple\/verify:/);
  assert.match(contract, /\/apple\/notifications:/);
  const worker = read("../src/cloudflare/worker.ts");
  assert.doesNotMatch(worker, /createCheckoutSession|grantMembership|RevenueCat/i);
  assert.match(worker, /APPLE_APP_ID/);
  assert.doesNotMatch(worker, /privateKey|notificationSecret|issuerId|keyId/);
  assert.match(worker, /BLUE_BADGE_PURCHASES_ENABLED==="true"/);
  assert.match(read("../src/cloudflare/apple-billing.ts"), /verifyAndDecodeNotification/);
  const cloudflare = read("../wrangler.toml");
  assert.match(cloudflare, /APPLE_APP_ID = "6787469528"/);
  assert.match(cloudflare, /BLUE_BADGE_PURCHASES_ENABLED = "true"/);
});

test("the preview is the Cloudflare relay rather than a separate membership backend", () => {
  const pkg = JSON.parse(read("../package.json"));
  assert.match(pkg.scripts.dev, /cloudflare-preview-gateway\.mjs/);
  assert.doesNotMatch(pkg.scripts.dev, /src\/index|src\/app/);
});
