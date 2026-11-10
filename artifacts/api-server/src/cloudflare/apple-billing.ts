import type { Environment as AppleEnvironment, SignedDataVerifier } from "@apple/app-store-server-library";
import appleRootCertificates from "./apple-root-certificates";
import { ApiError, body, json, object, type Database } from "./runtime";

export const BLUE_BADGE_APPLE_PRODUCT_ID = "com.oldtime.messenger.bluebbadge";
const BUNDLE_ID = "com.oldtime.messenger";
const MAX_TRANSACTION_JWS_BYTES = 32 * 1024;
const MAX_NOTIFICATION_BYTES = 64 * 1024;
const APPLE_PRODUCTION = "Production" as AppleEnvironment;
const APPLE_SANDBOX = "Sandbox" as AppleEnvironment;
const APPLE_ENVIRONMENTS: Array<typeof APPLE_PRODUCTION | typeof APPLE_SANDBOX> = [
  APPLE_PRODUCTION,
  APPLE_SANDBOX,
];

export interface AppleBillingConfig {
  enabled?: string;
  appId?: string;
}

interface AppleTransaction {
  appAppleId?: number;
  appAccountToken?: string;
  bundleId?: string;
  environment?: string;
  expiresDate?: number;
  originalTransactionId?: string;
  purchaseDate?: number;
  productId?: string;
  revocationDate?: number;
  signedDate?: number;
  transactionId?: string;
  type?: string;
}

interface AppleRenewalInfo {
  autoRenewStatus?: number;
  expirationIntent?: number;
  gracePeriodExpiresDate?: number;
  originalTransactionId?: string;
  productId?: string;
}

interface AppleNotification {
  notificationUUID?: string;
  notificationType?: string;
  signedDate?: number;
  data?: {
    appAppleId?: number;
    bundleId?: string;
    environment?: string;
    signedRenewalInfo?: string;
    signedTransactionInfo?: string;
  };
}

const verifierCache = new Map<string, SignedDataVerifier>();
let appleVerifierLibrary:
  | Promise<typeof import("@apple/app-store-server-library")>
  | undefined;

function loadAppleVerifierLibrary(): Promise<typeof import("@apple/app-store-server-library")> {
  appleVerifierLibrary ??= import("@apple/app-store-server-library");
  return appleVerifierLibrary;
}

function publicAppId(config: AppleBillingConfig): number | null {
  const id = Number(config.appId);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function configured(config: AppleBillingConfig): boolean {
  return config.enabled === "true" && publicAppId(config) !== null;
}

async function verifierFor(
  config: AppleBillingConfig,
  environment: typeof APPLE_PRODUCTION | typeof APPLE_SANDBOX,
): Promise<SignedDataVerifier | null> {
  const appId = publicAppId(config);
  if (environment === APPLE_PRODUCTION && appId === null) return null;
  const cacheKey = `${environment}:${appId ?? "sandbox"}`;
  const cached = verifierCache.get(cacheKey);
  if (cached) return cached;
  const { SignedDataVerifier: AppleSignedDataVerifier } = await loadAppleVerifierLibrary();
  const verifier = new AppleSignedDataVerifier(
    appleRootCertificates,
    true,
    environment,
    BUNDLE_ID,
    environment === APPLE_PRODUCTION ? appId! : undefined,
  );
  verifierCache.set(cacheKey, verifier);
  return verifier;
}

async function verifyTransactionJws(
  config: AppleBillingConfig,
  signedTransactionInfo: string,
): Promise<{ transaction: AppleTransaction; environment: typeof APPLE_PRODUCTION | typeof APPLE_SANDBOX }> {
  if (!signedTransactionInfo || signedTransactionInfo.length > MAX_TRANSACTION_JWS_BYTES) {
    throw new ApiError(400, "A valid Apple-signed transaction is required.");
  }
  for (const environment of APPLE_ENVIRONMENTS) {
    const verifier = await verifierFor(config, environment);
    if (!verifier) continue;
    try {
      const transaction = await verifier.verifyAndDecodeTransaction(signedTransactionInfo);
      return { transaction: transaction as AppleTransaction, environment };
    } catch {
      // Try the other Apple environment. Both paths still require full
      // certificate-chain and JWS-signature verification.
    }
  }
  throw new ApiError(422, "Apple’s signed transaction could not be verified.");
}

async function verifyNotificationJws(
  config: AppleBillingConfig,
  signedPayload: string,
): Promise<{
  notification: AppleNotification;
  verifier: SignedDataVerifier;
  environment: typeof APPLE_PRODUCTION | typeof APPLE_SANDBOX;
}> {
  if (!signedPayload || signedPayload.length > MAX_NOTIFICATION_BYTES) {
    throw new ApiError(400, "A valid Apple-signed notification is required.");
  }
  for (const environment of APPLE_ENVIRONMENTS) {
    const verifier = await verifierFor(config, environment);
    if (!verifier) continue;
    try {
      const notification = await verifier.verifyAndDecodeNotification(signedPayload);
      return {
        notification: notification as AppleNotification,
        verifier,
        environment,
      };
    } catch {
      // An invalid payload for one environment may be a valid payload for
      // the other environment; neither path trusts decoded claims alone.
    }
  }
  throw new ApiError(422, "Apple’s signed notification could not be verified.");
}

export function deriveAppleSubscriptionState(
  transaction: AppleTransaction,
  renewal: AppleRenewalInfo | null,
  now = Date.now(),
): {
  state: "active" | "expired" | "revoked" | "canceled" | "billing-issue";
  revokedAt: number | null;
  graceExpiresAt: number | null;
  autoRenews: number | null;
} {
  const expiresAt = Number(transaction.expiresDate);
  const revokedAt = Number(transaction.revocationDate) || null;
  const graceDate = Number(renewal?.gracePeriodExpiresDate) || null;
  const graceExpiresAt = graceDate && graceDate > now ? graceDate : null;
  let state: "active" | "expired" | "revoked" | "canceled" | "billing-issue" =
    expiresAt > now || graceExpiresAt ? "active" : "expired";
  if (revokedAt) state = "revoked";
  if (!revokedAt && state === "active" && renewal?.autoRenewStatus === 0) state = "canceled";
  if (!revokedAt && expiresAt <= now && !graceExpiresAt && renewal?.expirationIntent) {
    state = "billing-issue";
  }
  const autoRenews = renewal?.autoRenewStatus === 0 || renewal?.autoRenewStatus === 1
    ? renewal.autoRenewStatus
    : null;
  return { state, revokedAt, graceExpiresAt, autoRenews };
}

async function applyTransaction(
  db: Database,
  transaction: AppleTransaction,
  renewal: AppleRenewalInfo | null,
  signedEventAt?: number,
): Promise<string | null> {
  const appAccountToken = transaction.appAccountToken?.toLowerCase();
  const owner = appAccountToken
    ? await db.prepare("SELECT user_id FROM blue_badge_apple_accounts WHERE app_account_token=?")
      .bind(appAccountToken).first<{ user_id: string }>()
    : null;
  if (!owner) return null;

  const originalTransactionId = transaction.originalTransactionId;
  const transactionId = transaction.transactionId;
  const expiresAt = Number(transaction.expiresDate);
  if (!originalTransactionId || !transactionId || !Number.isSafeInteger(expiresAt) || expiresAt <= 0) {
    throw new ApiError(422, "Apple’s subscription record is missing required transaction details.");
  }

  const now = Date.now();
  const eventAt = Number.isSafeInteger(signedEventAt) && Number(signedEventAt) > 0
    ? Number(signedEventAt)
    : Number(transaction.signedDate) || now;
  const { state, revokedAt, graceExpiresAt: activeGraceExpiresAt, autoRenews } =
    deriveAppleSubscriptionState(transaction, renewal, now);
  const canceledAt = state === "canceled" ? eventAt : null;
  const billingIssueAt = state === "billing-issue" ? eventAt : null;
  const effectiveRevokedAt = state === "revoked" ? revokedAt : null;

  await db.batch([
    db.prepare(`
      INSERT INTO blue_badge_store_subscriptions (
        id,user_id,store,subscription_key,product_id,state,observed_at,verified_at,expires_at,
        auto_renews,canceled_at,revoked_at,billing_issue_at,intro_used,grace_expires_at
      ) VALUES (?,?,'apple',?,?,?,?,?,?,?,?,?,?,0,?)
      ON CONFLICT(store,subscription_key) DO UPDATE SET
        user_id=excluded.user_id, product_id=excluded.product_id, state=excluded.state,
        observed_at=excluded.observed_at, verified_at=excluded.verified_at,
        expires_at=excluded.expires_at, auto_renews=excluded.auto_renews,
        canceled_at=excluded.canceled_at, revoked_at=excluded.revoked_at,
        billing_issue_at=excluded.billing_issue_at, grace_expires_at=excluded.grace_expires_at
      WHERE excluded.observed_at >= blue_badge_store_subscriptions.observed_at
    `).bind(
      crypto.randomUUID(), owner.user_id, originalTransactionId, BLUE_BADGE_APPLE_PRODUCT_ID,
      state, eventAt, now, expiresAt, autoRenews, canceledAt, effectiveRevokedAt, billingIssueAt,
      activeGraceExpiresAt,
    ),
    db.prepare(`
      INSERT INTO blue_badge_entitlements (
        user_id,store,transaction_id,verified_at,expires_at,revoked_at,intro_used,
        state,auto_renews,canceled_at,billing_issue_at,last_store_event_at,grace_expires_at
      ) VALUES (?,'apple',?,?,?,?,0,?,?,?,?,?,?)
      ON CONFLICT(user_id) DO UPDATE SET
        store='apple', transaction_id=excluded.transaction_id,
        verified_at=excluded.verified_at, expires_at=excluded.expires_at,
        revoked_at=excluded.revoked_at, state=excluded.state,
        auto_renews=excluded.auto_renews, canceled_at=excluded.canceled_at,
        billing_issue_at=excluded.billing_issue_at,
        last_store_event_at=excluded.last_store_event_at,
        grace_expires_at=excluded.grace_expires_at
      WHERE excluded.last_store_event_at >= blue_badge_entitlements.last_store_event_at
    `).bind(
      owner.user_id, transactionId, now, expiresAt, effectiveRevokedAt, state,
      autoRenews, canceledAt, billingIssueAt, eventAt, activeGraceExpiresAt,
    ),
  ]);
  return owner.user_id;
}

async function syncAppleTransaction(
  db: Database,
  config: AppleBillingConfig,
  signedTransactionInfo: string,
): Promise<{ userId: string; active: boolean }> {
  const { transaction, environment } = await verifyTransactionJws(config, signedTransactionInfo);
  if (transaction.bundleId !== BUNDLE_ID ||
      transaction.productId !== BLUE_BADGE_APPLE_PRODUCT_ID ||
      transaction.type !== "Auto-Renewable Subscription" ||
      (environment === APPLE_PRODUCTION && transaction.appAppleId !== undefined &&
        Number(transaction.appAppleId) !== publicAppId(config)) ||
      !transaction.appAccountToken ||
      !transaction.originalTransactionId ||
      !transaction.transactionId) {
    throw new ApiError(422, "This Apple transaction is not a valid Oldtime Blue Badge subscription.");
  }

  const userId = await applyTransaction(db, transaction, null);
  if (!userId) throw new ApiError(403, "This Apple purchase is linked to a different Oldtime account.");
  const entitlement = await db.prepare(`
    SELECT state, expires_at, revoked_at, grace_expires_at
    FROM blue_badge_entitlements WHERE user_id=?
  `).bind(userId).first<{
    state: string;
    expires_at: number;
    revoked_at: number | null;
    grace_expires_at: number | null;
  }>();
  const activeUntil = Math.max(
    Number(entitlement?.expires_at ?? 0),
    Number(entitlement?.grace_expires_at ?? 0),
  );
  return {
    userId,
    active: !!entitlement && entitlement.state !== "revoked" &&
      entitlement.state !== "expired" && !entitlement.revoked_at && activeUntil > Date.now(),
  };
}

export async function createApplePurchaseContext(
  db: Database,
  userId: string,
  config: AppleBillingConfig,
): Promise<Response> {
  if (!configured(config)) throw new ApiError(503, "Apple subscriptions are not available yet.");
  const existing = await db.prepare(
    "SELECT app_account_token FROM blue_badge_apple_accounts WHERE user_id=?",
  ).bind(userId).first<{ app_account_token: string }>();
  if (existing) {
    return json({ appAccountToken: existing.app_account_token, productId: BLUE_BADGE_APPLE_PRODUCT_ID });
  }

  const appAccountToken = crypto.randomUUID().toLowerCase();
  await db.prepare(`
    INSERT INTO blue_badge_apple_accounts(user_id,app_account_token)
    VALUES(?,?) ON CONFLICT(user_id) DO NOTHING
  `).bind(userId, appAccountToken).run();
  const stored = await db.prepare(
    "SELECT app_account_token FROM blue_badge_apple_accounts WHERE user_id=?",
  ).bind(userId).first<{ app_account_token: string }>();
  if (!stored) throw new ApiError(503, "Apple purchase setup could not be completed.");
  return json({ appAccountToken: stored.app_account_token, productId: BLUE_BADGE_APPLE_PRODUCT_ID });
}

export async function verifyApplePurchase(
  request: Request,
  db: Database,
  userId: string,
  config: AppleBillingConfig,
): Promise<Response> {
  if (request.method !== "POST") throw new ApiError(405, "Method not allowed.");
  if (!configured(config)) throw new ApiError(503, "Apple purchase verification is not configured.");
  const parsed = await body(request, MAX_TRANSACTION_JWS_BYTES + 2048);
  const signedTransactionInfo = object(parsed).signedTransactionInfo;
  if (typeof signedTransactionInfo !== "string" ||
      signedTransactionInfo.length > MAX_TRANSACTION_JWS_BYTES) {
    throw new ApiError(400, "A valid Apple-signed transaction is required.");
  }
  const result = await syncAppleTransaction(db, config, signedTransactionInfo);
  if (result.userId !== userId) throw new ApiError(403, "This purchase belongs to a different Oldtime account.");
  return json({ verified: true, active: result.active });
}

export async function appleServerNotification(
  request: Request,
  db: Database,
  config: AppleBillingConfig,
): Promise<Response> {
  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);
  try {
    if (!publicAppId(config)) {
      throw new ApiError(503, "Apple’s public App Store ID is not configured.");
    }
    const parsed = object(await body(request, MAX_NOTIFICATION_BYTES));
    if (typeof parsed.signedPayload !== "string") {
      throw new ApiError(400, "Apple’s signed notification is required.");
    }
    const { notification, verifier, environment } = await verifyNotificationJws(
      config,
      parsed.signedPayload,
    );
    const eventId = notification.notificationUUID;
    if (!eventId || !/^[0-9a-f-]{36}$/i.test(eventId)) {
      throw new ApiError(422, "Apple’s notification is missing its event ID.");
    }
    const existing = await db.prepare(
      "SELECT event_id FROM blue_badge_store_events WHERE store='apple' AND event_id=?",
    ).bind(eventId).first<{ event_id: string }>();
    if (existing) return json({ received: true, applied: false });

    const data = notification.data;
    if (!data?.signedTransactionInfo) {
      await recordAppleNotification(db, eventId);
      return json({ received: true, applied: false });
    }

    const transaction = await verifier.verifyAndDecodeTransaction(data.signedTransactionInfo) as AppleTransaction;
    if (transaction.bundleId !== BUNDLE_ID ||
        transaction.productId !== BLUE_BADGE_APPLE_PRODUCT_ID ||
        transaction.type !== "Auto-Renewable Subscription") {
      await recordAppleNotification(db, eventId);
      return json({ received: true, applied: false });
    }
    if (environment === APPLE_PRODUCTION &&
        transaction.appAppleId !== undefined &&
        Number(transaction.appAppleId) !== publicAppId(config)) {
      throw new ApiError(422, "Apple’s notification belongs to a different app.");
    }

    let renewal: AppleRenewalInfo | null = null;
    if (data.signedRenewalInfo) {
      renewal = await verifier.verifyAndDecodeRenewalInfo(data.signedRenewalInfo) as AppleRenewalInfo;
      if ((renewal.productId && renewal.productId !== BLUE_BADGE_APPLE_PRODUCT_ID) ||
          (renewal.originalTransactionId &&
            renewal.originalTransactionId !== transaction.originalTransactionId)) {
        throw new ApiError(422, "Apple’s renewal information does not match its transaction.");
      }
    }
    const eventAt = Number(notification.signedDate) || Number(transaction.signedDate) || Date.now();
    const revocableNotification = ["REFUND", "REVOKE"].includes(notification.notificationType ?? "");
    const currentTransaction = revocableNotification && !transaction.revocationDate
      ? { ...transaction, revocationDate: eventAt }
      : transaction;
    const ownerId = await applyTransaction(
      db,
      currentTransaction,
      renewal,
      eventAt,
    );
    await recordAppleNotification(db, eventId);
    return json({ received: true, applied: !!ownerId });
  } catch (error) {
    if (error instanceof ApiError) {
      const status = error.status >= 500 ? 503 : error.status;
      return json({ error: error.message }, status);
    }
    return json({ error: "Apple notification processing is temporarily unavailable." }, 503);
  }
}

async function recordAppleNotification(db: Database, eventId: string): Promise<void> {
  await db.prepare(`
    INSERT OR IGNORE INTO blue_badge_store_events(store,event_id,received_at)
    VALUES('apple',?,?)
  `).bind(eventId, Date.now()).run();
}
