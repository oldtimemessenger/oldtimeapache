-- Keep per-keyword contributor counts distinct from aggregate weights.
-- This prevents a phrase searched by one person from surfacing because
-- unrelated searches brought the overall video total above the privacy floor.
CREATE TABLE IF NOT EXISTS video_search_contributors (
  video_id TEXT NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  first_seen_at INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL,
  PRIMARY KEY(video_id, keyword, user_id)
);

-- Existing click rows retain their exact normalized phrase, so safely backfill
-- phrase contributors. Token-level contributors accumulate on future searches.
INSERT OR IGNORE INTO video_search_contributors
  (video_id, keyword, user_id, first_seen_at, last_seen_at)
SELECT video_id, query_text, user_id, MIN(created_at), MAX(created_at)
FROM search_clicks
GROUP BY video_id, query_text, user_id;
