CREATE TABLE IF NOT EXISTS "blue_badge_apple_accounts" (
  "user_id" TEXT PRIMARY KEY NOT NULL,
  "app_account_token" TEXT NOT NULL UNIQUE,
  "created_at" INTEGER NOT NULL DEFAULT (CAST((julianday('now') - 2440587.5) * 86400000 AS INTEGER)),
  CONSTRAINT "blue_badge_apple_accounts_user_id_users_id_fk"
    FOREIGN KEY ("user_id") REFERENCES "users" ("id")
);

ALTER TABLE "blue_badge_entitlements"
  ADD COLUMN "last_store_event_at" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "blue_badge_store_subscriptions"
  ADD COLUMN "grace_expires_at" INTEGER;

ALTER TABLE "blue_badge_entitlements"
  ADD COLUMN "grace_expires_at" INTEGER;
