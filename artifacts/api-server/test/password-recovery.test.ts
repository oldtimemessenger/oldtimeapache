import assert from "node:assert/strict";
import { test } from "node:test";
import type { Database, D1Result, Statement } from "../src/cloudflare/runtime";
import {
  confirmPasswordRecovery,
  requestPasswordRecovery,
} from "../src/cloudflare/password-recovery";
import type { VerificationEmailPayload } from "../src/cloudflare/email-verification";

interface RecoveryRow {
  user_id: string;
  token_hash: string;
  created_at: number;
  expires_at: number;
  consumed_at: number | null;
  claim_id: string | null;
}

class RecoveryDatabase implements Database {
  user = {
    id: "account-1",
    email: "person@example.com",
    password_salt: "old-salt",
    password_hash: "old-hash",
  };
  recovery: RecoveryRow | null = null;
  sessions = ["session-1", "session-2"];

  prepare(sql: string): Statement {
    const database = this;
    let values: unknown[] = [];
    const statement = {
      sql,
      get values() { return values; },
      bind(...bound: unknown[]) {
        values = bound;
        return this;
      },
      async all<T>(): Promise<D1Result<T>> {
        return { success: true, results: [] };
      },
      async first<T>(): Promise<T | null> {
        if (sql.includes("SELECT id, email") && String(values[0]).toLowerCase() === database.user.email) {
          return { id: database.user.id, email: database.user.email } as T;
        }
        if (sql.includes("SELECT user_id, expires_at")) {
          const row = database.recovery;
          if (row?.token_hash === values[0] && row.consumed_at === null) {
            return { user_id: row.user_id, expires_at: row.expires_at } as T;
          }
        }
        return null;
      },
      async run<T = unknown>(): Promise<D1Result<T>> {
        if (sql.includes("INSERT INTO password_recovery_requests")) {
          const now = Number(values[2]);
          if (database.recovery && database.recovery.created_at > now - Number(values[4])) {
            return { success: true, meta: { changes: 0 } };
          }
          database.recovery = {
            user_id: String(values[0]),
            token_hash: String(values[1]),
            created_at: now,
            expires_at: Number(values[3]),
            consumed_at: null,
            claim_id: null,
          };
        } else if (sql.includes("DELETE FROM password_recovery_requests")) {
          if (database.recovery?.user_id === values[0] && database.recovery.token_hash === values[1]) {
            database.recovery = null;
          }
        }
        return { success: true, meta: { changes: 1 } };
      },
    };
    return statement as Statement;
  }

  async batch<T = unknown>(statements: Statement[]): Promise<D1Result<T>[]> {
    const results: D1Result<T>[] = [];
    for (const statement of statements) {
      const query = statement as Statement & { sql?: string; values?: unknown[] };
      const sql = query.sql || "";
      const values = query.values || [];
      let changes = 0;
      if (sql.includes("UPDATE password_recovery_requests")) {
        const [consumedAt, claimId, userId, tokenHash, now] = values;
        const row = this.recovery;
        if (row?.user_id === userId && row.token_hash === tokenHash &&
            row.consumed_at === null && row.expires_at > Number(now)) {
          row.consumed_at = Number(consumedAt);
          row.claim_id = String(claimId);
          changes = 1;
        }
      } else if (sql.includes("UPDATE users")) {
        const [salt, hash, userId, rowUserId, tokenHash, claimId, consumedAt] = values;
        const row = this.recovery;
        if (this.user.id === userId && row?.user_id === rowUserId &&
            row.token_hash === tokenHash && row.claim_id === claimId &&
            row.consumed_at === consumedAt) {
          this.user.password_salt = String(salt);
          this.user.password_hash = String(hash);
          changes = 1;
        }
      } else if (sql.includes("DELETE FROM sessions")) {
        const [userId, rowUserId, tokenHash, claimId, consumedAt] = values;
        const row = this.recovery;
        if (this.user.id === userId && row?.user_id === rowUserId &&
            row.token_hash === tokenHash && row.claim_id === claimId &&
            row.consumed_at === consumedAt) {
          changes = this.sessions.length;
          this.sessions = [];
        }
      } else if (sql.includes("DELETE FROM password_recovery_requests")) {
        const [userId, tokenHash, claimId] = values;
        if (this.recovery?.user_id === userId &&
            this.recovery.token_hash === tokenHash &&
            this.recovery.claim_id === claimId) {
          this.recovery = null;
          changes = 1;
        }
      }
      results.push({ success: true, meta: { changes } });
    }
    return results;
  }
}

function post(path: string, payload: unknown): Request {
  return new Request(`https://heyoldtime.com/api/auth/${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
}

test("password recovery requests do not disclose whether an email belongs to an account", async () => {
  const db = new RecoveryDatabase();
  const sent: VerificationEmailPayload[] = [];
  const env = { DB: db, RESEND_API_KEY: "test-secret" };
  const sendEmail = async (_key: string, payload: VerificationEmailPayload) => {
    sent.push(payload);
    return true;
  };

  const known = await requestPasswordRecovery(
    post("password/recovery/request", { email: db.user.email }),
    env,
    sendEmail,
  );
  const unknown = await requestPasswordRecovery(
    post("password/recovery/request", { email: "unknown@example.com" }),
    env,
    sendEmail,
  );

  assert.equal(known.status, 200);
  assert.equal(unknown.status, 200);
  assert.deepEqual(await known.json(), await unknown.json());
  assert.equal(sent.length, 1);
  assert.equal(db.recovery?.token_hash.length, 64);
  assert.equal(sent[0].text.includes(db.recovery?.token_hash || ""), false);
});

test("a reset token is single-use, updates credentials, and revokes every session", async () => {
  const db = new RecoveryDatabase();
  const sent: VerificationEmailPayload[] = [];
  const env = { DB: db, RESEND_API_KEY: "test-secret" };
  const sendEmail = async (_key: string, payload: VerificationEmailPayload) => {
    sent.push(payload);
    return true;
  };

  await requestPasswordRecovery(
    post("password/recovery/request", { email: db.user.email }),
    env,
    sendEmail,
  );
  const token = /#password-reset=([A-Za-z0-9_-]{43})/.exec(sent[0].text)?.[1];
  assert.ok(token);

  const makeCredentials = async (password: string) => ({
    passwordSalt: "new-salt",
    passwordHash: `hash:${password}`,
  });
  const result = await confirmPasswordRecovery(
    post("password/recovery/confirm", { token, newPassword: "new secure passphrase" }),
    env,
    makeCredentials,
  );
  assert.equal(result.status, 200);
  assert.deepEqual(await result.json(), { ok: true });
  assert.equal(db.user.password_salt, "new-salt");
  assert.equal(db.user.password_hash, "hash:new secure passphrase");
  assert.deepEqual(db.sessions, []);
  assert.equal(db.recovery, null);

  const reused = await confirmPasswordRecovery(
    post("password/recovery/confirm", { token, newPassword: "another secure passphrase" }),
    env,
    makeCredentials,
  );
  assert.equal(reused.status, 410);
});
