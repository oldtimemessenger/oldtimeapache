CREATE TABLE IF NOT EXISTS open_mic_rooms (
  id TEXT PRIMARY KEY NOT NULL,
  owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  topic TEXT NOT NULL DEFAULT '',
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public','unlisted')),
  status TEXT NOT NULL DEFAULT 'live' CHECK (status IN ('live','ended')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  ended_at INTEGER
);
CREATE INDEX IF NOT EXISTS open_mic_rooms_discovery_idx
  ON open_mic_rooms(status, visibility, updated_at DESC);
CREATE INDEX IF NOT EXISTS open_mic_rooms_owner_idx
  ON open_mic_rooms(owner_id, status, created_at DESC);

CREATE TABLE IF NOT EXISTS open_mic_participants (
  room_id TEXT NOT NULL REFERENCES open_mic_rooms(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'listener' CHECK (role IN ('host','listener')),
  host_muted INTEGER NOT NULL DEFAULT 0 CHECK (host_muted IN (0,1)),
  joined_at INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL,
  PRIMARY KEY (room_id, user_id)
);
CREATE INDEX IF NOT EXISTS open_mic_participants_presence_idx
  ON open_mic_participants(room_id, last_seen_at DESC);
