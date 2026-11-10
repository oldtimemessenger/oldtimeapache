import test from "node:test";
import assert from "node:assert/strict";
import type { Database, Statement } from "./runtime";
import {
  highestVideoSearchInsight,
  normalizeVideoSearchText,
  recordVideoSearchClick,
  videoSearchIndexStatements,
  videoSearchTerms,
  wholeSearchWatchSeconds,
} from "./video-search-insights";

type PreparedCall = { sql: string; values: unknown[] };

function fakeDatabase(
  read: (sql: string, values: unknown[]) => unknown = () => null,
  clickInsertChanges = 1,
) {
  const prepared: PreparedCall[] = [];
  const batches: Statement[][] = [];
  const db = {
    prepare(sql: string) {
      const call: PreparedCall = { sql, values: [] };
      const statement = {
        bind(...values: unknown[]) {
          call.values = values;
          return statement;
        },
        async first<T>() {
          return read(sql, call.values) as T | null;
        },
        async all<T>() {
          return { success: true, results: [] as T[] };
        },
        async run<T>() {
          return { success: true } as { success: true };
        },
      };
      prepared.push(call);
      return statement as unknown as Statement;
    },
    async batch(statements: Statement[]) {
      batches.push(statements);
      return statements.map((_, index) => ({
        success: true,
        meta: { changes: index === 0 ? clickInsertChanges : 1 },
      }));
    },
  };
  return { db: db as unknown as Database, prepared, batches };
}

test("normalizes query punctuation, case, links, and whitespace", () => {
  assert.equal(normalizeVideoSearchText("  🔍 FT Call, MISSED meme!! https://example.com/x "), "ft call missed meme");
});

test("removes stop words and duplicate terms", () => {
  assert.deepEqual(videoSearchTerms("The FT call is a missed meme, meme!"), ["ft","call","missed","meme"]);
});

test("keeps Unicode search terms", () => {
  assert.deepEqual(videoSearchTerms("café 東京"), ["café","東京"]);
});

test("video upload indexing stores caption terms and hashtags at baseline weight", () => {
  const f = fakeDatabase();
  videoSearchIndexStatements(f.db, {
    id: "video-1", creatorId: "creator-1", caption: "The FT call is a missed meme #Funny",
    isPublic: true, createdAt: 123,
  });

  const video = f.prepared.find(call => call.sql.includes("INSERT INTO videos"));
  assert.ok(video);
  assert.deepEqual(video.values.slice(0, 4), [
    "video-1", "creator-1", "The FT call is a missed meme #Funny", '["funny"]',
  ]);
  const captionTerms = f.prepared.filter(call =>
    call.sql.includes("INSERT INTO video_search_index") && call.sql.includes("'caption'"));
  const hashtagTerms = f.prepared.filter(call =>
    call.sql.includes("INSERT INTO video_search_index") && call.sql.includes("'hashtag'"));
  assert.deepEqual(captionTerms.map(call => call.values[0]), ["ft", "call", "missed", "meme", "funny"]);
  assert.deepEqual(hashtagTerms.map(call => call.values[0]), ["funny"]);
  assert.ok(captionTerms.every(call => call.sql.includes("VALUES(?,?,1,'caption',?)")));
  assert.ok(hashtagTerms.every(call => call.sql.includes("VALUES(?,?,1,'hashtag',?)")));
});

test("private videos are removed from the searchable video index", () => {
  const f = fakeDatabase();
  const statements = videoSearchIndexStatements(f.db, {
    id: "video-1", creatorId: "creator-1", caption: "private", isPublic: false, createdAt: 123,
  });
  assert.equal(statements.length, 1);
  assert.match(f.prepared[0].sql, /DELETE FROM videos WHERE id=\?/);
});

test("only more than five whole seconds qualify for search learning", () => {
  assert.equal(wholeSearchWatchSeconds(5), null);
  assert.equal(wholeSearchWatchSeconds(5.99), null);
  assert.equal(wholeSearchWatchSeconds(6), 6);
  assert.equal(wholeSearchWatchSeconds(3600), 3600);
  assert.equal(wholeSearchWatchSeconds(3601), null);
  assert.equal(wholeSearchWatchSeconds("6"), null);
});

test("a qualifying search click adds five points and records distinct keyword contributors", async () => {
  const f = fakeDatabase();
  const result = await recordVideoSearchClick(f.db, {
    userId: "user-1", videoId: "video-1", queryText: "FT Call Missed Meme", watchTime: 6.8, now: 86_400_000,
  });

  assert.deepEqual(result, { learned: true, keywords: ["ft call missed meme", "ft", "call", "missed", "meme"] });
  assert.equal(f.batches.length, 1);
  const click = f.prepared.find(call => call.sql.includes("INSERT INTO search_clicks"));
  assert.ok(click);
  assert.equal(click.values[1], "user-1");
  assert.equal(click.values[2], "ft call missed meme");
  assert.equal(click.values[4], 6);
  const scoreUpdates = f.prepared.filter(call => call.sql.includes("INSERT INTO video_search_index"));
  assert.equal(scoreUpdates.length, 5);
  assert.ok(scoreUpdates.every(call => call.sql.includes("SELECT ?,?,5,")));
  assert.ok(scoreUpdates.every(call => call.sql.includes("WHERE EXISTS(SELECT 1 FROM search_clicks WHERE id=?)")));
  const contributors = f.prepared.filter(call => call.sql.includes("INSERT INTO video_search_contributors"));
  assert.deepEqual(contributors.map(call => call.values.slice(0, 3)), [
    ["video-1", "ft call missed meme", "user-1"],
    ["video-1", "ft", "user-1"],
    ["video-1", "call", "user-1"],
    ["video-1", "missed", "user-1"],
    ["video-1", "meme", "user-1"],
  ]);
  const clickId = f.prepared.find(call => call.sql.includes("INSERT INTO search_clicks"))?.values[0];
  assert.ok(clickId);
  assert.ok([...scoreUpdates, ...contributors].every(call => call.values.at(-1) === clickId));
});

test("a duplicate daily search click does not increment weights or contributor rows", async () => {
  const f = fakeDatabase(() => null, 0);
  const result = await recordVideoSearchClick(f.db, {
    userId: "user-1", videoId: "video-1", queryText: "meme", watchTime: 8, now: 86_400_000,
  });
  assert.deepEqual(result, { learned: false, keywords: [] });
  assert.equal(f.batches.length, 1);
  const followupWrites = f.prepared.filter(call =>
    call.sql.includes("INSERT INTO video_search_index") || call.sql.includes("INSERT INTO video_search_contributors"));
  assert.ok(followupWrites.length > 0);
  assert.ok(followupWrites.every(call => call.sql.includes("WHERE EXISTS(SELECT 1 FROM search_clicks WHERE id=?)")));
});

test("the top insight query filters each keyword by its own distinct-contributor threshold", async () => {
  const f = fakeDatabase(() => ({ keyword: "meme", weight_score: 17 }));
  const insight = await highestVideoSearchInsight(f.db, "video-1");
  assert.deepEqual(insight, { keyword: "meme", weight_score: 17 });
  assert.equal(f.prepared.length, 1, "the aggregate and contributor qualification use one query");
  assert.match(f.prepared[0].sql, /FROM video_search_contributors/);
  assert.match(f.prepared[0].sql, /HAVING COUNT\(\*\) >= \?/);
  assert.deepEqual(f.prepared[0].values, ["video-1", "video-1", 2]);
});
