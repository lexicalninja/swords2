-- Migration 001: Initial schema
-- Future tables to add: users, daily_scores, streaks

CREATE TABLE IF NOT EXISTS puzzles (
  id          SERIAL PRIMARY KEY,
  outer_word  TEXT    NOT NULL,
  inner_word  TEXT    NOT NULL,
  start_index INTEGER NOT NULL,
  hints       JSONB   NOT NULL,       -- array of 4 hint strings: vague → obvious
  difficulty  TEXT    NOT NULL        -- 'easy' | 'medium' | 'hard'
                CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast difficulty filtering (daily puzzle selection)
CREATE INDEX IF NOT EXISTS puzzles_difficulty_idx ON puzzles (difficulty);

-- ── Future tables (not yet implemented) ────────────────────────────────────
--
-- CREATE TABLE users (
--   id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   username   TEXT UNIQUE NOT NULL,
--   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
-- );
--
-- CREATE TABLE daily_scores (
--   id         SERIAL PRIMARY KEY,
--   user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
--   date       DATE NOT NULL,
--   score      INTEGER NOT NULL,
--   max_score  INTEGER NOT NULL,
--   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
--   UNIQUE (user_id, date)
-- );
--
-- CREATE TABLE streaks (
--   user_id       UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
--   current       INTEGER NOT NULL DEFAULT 0,
--   longest       INTEGER NOT NULL DEFAULT 0,
--   last_played   DATE,
--   updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
-- );
