-- =============================================================================
-- Phase 10 migration — Google Sheet auto-sync for offers.
-- Run this in the Supabase SQL Editor.
--
-- Adds:
--   sheet_sync_settings — single-row config (spreadsheet id, tab GIDs, schedule)
--   sheet_sync_logs     — history of each sync run (manual or scheduled)
-- =============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS sheet_sync_settings (
  id            SMALLINT PRIMARY KEY DEFAULT 1,
  spreadsheet_id TEXT,
  tab_gids      TEXT,             -- comma-separated GIDs, one per store tab
  frequency     TEXT NOT NULL DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly')),
  day_of_week   SMALLINT CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sun..6=Sat, used when frequency='weekly'
  time_of_day   TEXT NOT NULL DEFAULT '09:00', -- "HH:MM", IST
  enabled       BOOLEAN NOT NULL DEFAULT false,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT sheet_sync_settings_single_row CHECK (id = 1)
);

-- Seed the single settings row so the admin UI always has something to load.
INSERT INTO sheet_sync_settings (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS sheet_sync_logs (
  id            BIGSERIAL PRIMARY KEY,
  run_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  trigger       TEXT NOT NULL CHECK (trigger IN ('manual', 'scheduled')),
  status        TEXT NOT NULL CHECK (status IN ('success', 'error')),
  summary       JSONB,            -- [{ code, rows, cleared }, ...] per store
  error_message TEXT
);

CREATE INDEX IF NOT EXISTS idx_sheet_sync_logs_run_at ON sheet_sync_logs(run_at DESC);

COMMIT;
