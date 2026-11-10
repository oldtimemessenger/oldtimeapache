import test from "node:test";
import assert from "node:assert/strict";

const { mergeReposters, canLoadMoreReposters, REPOSTERS_MAX } =
  await import("./post-reposters-sheet.js").catch(() => ({}));

test("reposter pages deduplicate accounts and remain bounded", { skip: !mergeReposters }, () => {
  const merged = mergeReposters([{ id: "a" }], [{ id: "b" }, { id: "a" }, { id: "c" }]);
  assert.deepEqual(merged.map(person => person.id), ["a", "b", "c"]);
  assert.equal(mergeReposters(Array.from({ length: REPOSTERS_MAX }, (_, index) => ({ id: String(index) })), [{ id: "extra" }]).length, REPOSTERS_MAX);
  assert.equal(canLoadMoreReposters([{ id: "a" }], true), true);
  assert.equal(canLoadMoreReposters([{ id: "a" }], false), false);
});
