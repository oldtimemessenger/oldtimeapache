import { randomBytes, randomUUID } from "node:crypto";
import {
  ConfirmPasswordRecoveryBody,
  RequestPasswordRecoveryBody,
} from "@workspace/api-zod";
import { ApiError, body, json, type Database } from "./runtime";
import { passwordRecoveryEmail } from "./account-email-template";
import {
  sendResendEmail,
  tokenHash,
  type ResendSender,
} from "./email-verification";

interface PasswordRecoveryEnv {
  DB: Database;
  RESEND_API_KEY?: string;
}

interface PasswordCredentials {
  passwordSalt: string;
  passwordHash: string;
}

type PasswordCredentialFactory = (password: string) => Promise<PasswordCredentials>;

const RECOVERY_WINDOW_MS = 60_000;
const RECOVERY_TOKEN_TTL_MS = 30 * 60_000;
const RESET_ORIGIN = "https://heyoldtime.com";
const GENERIC_REQUEST_MESSAGE =
  "If an Oldtime account uses that email, reset instructions will be sent shortly.";
const INVALID_TOKEN_MESSAGE =
  "This reset link is invalid or expired. Request a new one.";

function errorResponse(error: unknown, fallback: string): Response {
  if (error instanceof ApiError) return json({ error: error.message }, error.status);
  return json({ error: fallback }, 400);
}

export async function requestPasswordRecovery(
  request: Request,
  env: PasswordRecoveryEnv,
  sendEmail: ResendSender = sendResendEmail,
): Promise<Response> {
  let input: unknown;
  try {
    input = await body(request, 4096);
  } catch (error) {
    return errorResponse(error, "Enter a valid email address.");
  }
  const parsed = RequestPasswordRecoveryBody.safeParse(input);
  if (!parsed.success) return json({ error: "Enter a valid email address." }, 400);
  if (!env.RESEND_API_KEY) {
    return json({ error: "Password recovery is temporarily unavailable." }, 503);
  }

  const email = parsed.data.email.trim().toLowerCase();
  const user = await env.DB.prepare(`
    SELECT id, email
    FROM users
    WHERE lower(email) = ?
    LIMIT 1
  `).bind(email).first<{ id: string; email: string }>();

  if (!user) return json({ ok: true, message: GENERIC_REQUEST_MESSAGE });

  const now = Date.now();
  const token = randomBytes(32).toString("base64url");
  const digest = tokenHash(token);
  const reservation = await env.DB.prepare(`
    INSERT INTO password_recovery_requests
      (user_id, token_hash, created_at, expires_at, consumed_at, claim_id)
    VALUES (?, ?, ?, ?, NULL, NULL)
    ON CONFLICT(user_id) DO UPDATE SET
      token_hash = excluded.token_hash,
      created_at = excluded.created_at,
      expires_at = excluded.expires_at,
      consumed_at = NULL,
      claim_id = NULL
    WHERE password_recovery_requests.created_at <= excluded.created_at - ?
  `).bind(
    user.id,
    digest,
    now,
    now + RECOVERY_TOKEN_TTL_MS,
    RECOVERY_WINDOW_MS,
  ).run();

  if (reservation.meta?.changes === 0) {
    return json({ ok: true, message: GENERIC_REQUEST_MESSAGE });
  }

  const resetLink = `${RESET_ORIGIN}/#password-reset=${token}`;
  try {
    const sent = await sendEmail(
      env.RESEND_API_KEY,
      passwordRecoveryEmail(user.email, resetLink),
    );
    if (!sent) throw new Error("Recovery email provider rejected the request.");
  } catch {
    await env.DB.prepare(`
      DELETE FROM password_recovery_requests
      WHERE user_id = ? AND token_hash = ?
    `).bind(user.id, digest).run().catch(() => undefined);
    console.error("Oldtime password recovery email delivery failed.");
  }

  return json({ ok: true, message: GENERIC_REQUEST_MESSAGE });
}

export async function confirmPasswordRecovery(
  request: Request,
  env: PasswordRecoveryEnv,
  makeCredentials: PasswordCredentialFactory,
): Promise<Response> {
  let input: unknown;
  try {
    input = await body(request, 4096);
  } catch (error) {
    return errorResponse(error, "Enter a valid reset link and password.");
  }
  const parsed = ConfirmPasswordRecoveryBody.safeParse(input);
  if (!parsed.success) {
    return json({ error: "Passwords must be between 8 and 128 characters." }, 400);
  }

  const now = Date.now();
  const digest = tokenHash(parsed.data.token);
  const pending = await env.DB.prepare(`
    SELECT user_id, expires_at
    FROM password_recovery_requests
    WHERE token_hash = ? AND consumed_at IS NULL
  `).bind(digest).first<{ user_id: string; expires_at: number }>();

  if (!pending || pending.expires_at <= now) {
    if (pending) {
      await env.DB.prepare(`
        DELETE FROM password_recovery_requests
        WHERE user_id = ? AND token_hash = ? AND expires_at <= ?
      `).bind(pending.user_id, digest, now).run();
    }
    return json({ error: INVALID_TOKEN_MESSAGE }, 410);
  }

  const credentials = await makeCredentials(parsed.data.newPassword);
  const claimId = randomUUID();
  const results = await env.DB.batch([
    env.DB.prepare(`
      UPDATE password_recovery_requests
      SET consumed_at = ?, claim_id = ?
      WHERE user_id = ? AND token_hash = ? AND consumed_at IS NULL AND expires_at > ?
    `).bind(now, claimId, pending.user_id, digest, now),
    env.DB.prepare(`
      UPDATE users
      SET password_salt = ?, password_hash = ?
      WHERE id = ? AND EXISTS (
        SELECT 1 FROM password_recovery_requests
        WHERE user_id = ? AND token_hash = ? AND claim_id = ? AND consumed_at = ?
      )
    `).bind(
      credentials.passwordSalt,
      credentials.passwordHash,
      pending.user_id,
      pending.user_id,
      digest,
      claimId,
      now,
    ),
    env.DB.prepare(`
      DELETE FROM sessions
      WHERE user_id = ? AND EXISTS (
        SELECT 1 FROM password_recovery_requests
        WHERE user_id = ? AND token_hash = ? AND claim_id = ? AND consumed_at = ?
      )
    `).bind(pending.user_id, pending.user_id, digest, claimId, now),
    env.DB.prepare(`
      DELETE FROM password_recovery_requests
      WHERE user_id = ? AND token_hash = ? AND claim_id = ?
    `).bind(pending.user_id, digest, claimId),
  ]);

  if ((results[1]?.meta?.changes ?? 0) !== 1) {
    return json({ error: INVALID_TOKEN_MESSAGE }, 410);
  }
  return json({ ok: true });
}
