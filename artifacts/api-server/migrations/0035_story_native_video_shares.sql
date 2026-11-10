-- Native Story overlays let approved public feed videos be shared without
-- rendering and uploading a second flattened copy on the phone.
ALTER TABLE stories ADD COLUMN creative_project TEXT;
ALTER TABLE stories ADD COLUMN source_media_id TEXT REFERENCES user_media_assets(id) ON DELETE CASCADE;
CREATE INDEX stories_source_media_idx ON stories(source_media_id) WHERE source_media_id IS NOT NULL;
