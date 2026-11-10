import assert from "node:assert/strict";
import test from "node:test";
import { profileUpdateSchema } from "@workspace/api-zod";
import { publicDetails } from "../src/cloudflare/runtime.ts";

const account = {
  username: "samplemember",
  displayName: "Sample Member",
  email: "sample@example.com",
};

test("profile notes are accepted by profile updates and shown on visible profiles", () => {
  const note = "Available for questions";
  const parsed = profileUpdateSchema.safeParse({ ...account, profile: { profileNote: note } });
  assert.equal(parsed.success, true);
  if (!parsed.success) return;
  assert.equal(parsed.data.profile.profileNote, note);
  assert.deepEqual(publicDetails({ profile: { profileNote: note } }), { profileNote: note });
});

test("profile notes stay within 80 characters and empty notes are not public", () => {
  assert.equal(profileUpdateSchema.safeParse({
    ...account,
    profile: { profileNote: "x".repeat(81) },
  }).success, false);
  assert.deepEqual(publicDetails({ profile: { profileNote: "  " } }), {});
});
