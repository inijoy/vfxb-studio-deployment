-- ============================================================
-- VFXB Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email           text UNIQUE NOT NULL,
    full_name       text,
    avatar_url      text,
    plan            text NOT NULL DEFAULT 'free'
                    CHECK (plan IN ('free', 'pro', 'enterprise')),
    creator_mode    text NOT NULL DEFAULT 'longform'
                    CHECK (creator_mode IN ('longform', 'shortform', 'agency')),
    videos_used     int NOT NULL DEFAULT 0,
    videos_limit    int NOT NULL DEFAULT 3,
    creator_dna     jsonb,
    api_key         text UNIQUE,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- VIDEOS
-- ============================================================
CREATE TABLE IF NOT EXISTS videos (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           text NOT NULL DEFAULT 'Untitled Video',
    original_url    text,
    processed_url   text,
    thumbnail_url   text,
    duration        int,
    file_size       bigint,
    resolution      text,
    fps             int,
    status          text NOT NULL DEFAULT 'uploading'
                    CHECK (status IN (
                        'uploading', 'processing', 'transcribing',
                        'analyzing', 'scoring', 'analyzed',
                        'editing', 'done', 'error'
                    )),
    virality_score  int CHECK (virality_score BETWEEN 0 AND 100),
    score_breakdown jsonb,
    transcript      text,
    analysis        jsonb,
    platform        text NOT NULL DEFAULT 'youtube',
    error_message   text,
    r2_key          text,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS videos_user_id_idx ON videos(user_id);
CREATE INDEX IF NOT EXISTS videos_status_idx ON videos(status);
CREATE INDEX IF NOT EXISTS videos_created_at_idx ON videos(created_at DESC);

-- ============================================================
-- EDITS
-- ============================================================
CREATE TABLE IF NOT EXISTS edits (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id        uuid NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    user_id         uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type            text NOT NULL
                    CHECK (type IN (
                        'trim', 'cut_silence', 'speed', 'caption',
                        'audio_replace', 'platform_export', 'color_grade',
                        'transition', 'extract_clip'
                    )),
    instruction     text NOT NULL,
    ai_response     text,
    agent_used      text DEFAULT 'vfxb',
    ffmpeg_command  text,
    before_score    int,
    after_score     int,
    status          text NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'queued', 'processing', 'done', 'failed', 'reverted')),
    output_url      text,
    output_r2_key   text,
    params          jsonb,
    rq_job_id       text,
    created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS edits_video_id_idx ON edits(video_id);
CREATE INDEX IF NOT EXISTS edits_user_id_idx ON edits(user_id);

-- ============================================================
-- CHAT MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_messages (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id        uuid NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    user_id         uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role            text NOT NULL CHECK (role IN ('user', 'assistant')),
    content         text NOT NULL,
    agent           text DEFAULT 'vfxb',
    edit_id         uuid REFERENCES edits(id),
    metadata        jsonb,
    created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS chat_messages_video_id_idx ON chat_messages(video_id);
CREATE INDEX IF NOT EXISTS chat_messages_created_at_idx ON chat_messages(created_at DESC);

-- ============================================================
-- EXPORTS
-- ============================================================
CREATE TABLE IF NOT EXISTS exports (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id        uuid NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    user_id         uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform        text NOT NULL
                    CHECK (platform IN (
                        'youtube', 'tiktok', 'instagram', 'linkedin',
                        'twitter', 'shorts', 'facebook'
                    )),
    resolution      text,
    format          text DEFAULT 'mp4',
    output_url      text,
    output_r2_key   text,
    status          text NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'processing', 'done', 'failed')),
    rq_job_id       text,
    created_at      timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS subscriptions (
    id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    stripe_customer_id      text UNIQUE,
    stripe_subscription_id  text UNIQUE,
    plan                    text NOT NULL DEFAULT 'free'
                            CHECK (plan IN ('free', 'pro', 'enterprise')),
    status                  text NOT NULL DEFAULT 'active'
                            CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
    current_period_end      timestamptz,
    created_at              timestamptz NOT NULL DEFAULT now(),
    updated_at              timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER videos_updated_at
    BEFORE UPDATE ON videos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE edits ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users: see and edit own profile only
CREATE POLICY "users_own" ON users
    FOR ALL USING (auth.uid() = id);

-- Videos: see and edit own videos only
CREATE POLICY "videos_own" ON videos
    FOR ALL USING (auth.uid() = user_id);

-- Edits: see own edits only
CREATE POLICY "edits_own" ON edits
    FOR ALL USING (auth.uid() = user_id);

-- Chat: see own chat history only
CREATE POLICY "chat_own" ON chat_messages
    FOR ALL USING (auth.uid() = user_id);

-- Exports: see own exports only
CREATE POLICY "exports_own" ON exports
    FOR ALL USING (auth.uid() = user_id);

-- Subscriptions: see own subscription only
CREATE POLICY "subscriptions_own" ON subscriptions
    FOR ALL USING (auth.uid() = user_id);
