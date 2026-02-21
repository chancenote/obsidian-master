-- Obsidian Master: 초기 DB 스키마
-- Supabase SQL Editor에서 실행하거나 supabase db push로 적용

-- ============================================================
-- 3.1: progress 테이블 (학습 완료 기록)
-- ============================================================
CREATE TABLE IF NOT EXISTS progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day INTEGER NOT NULL CHECK (day >= 1 AND day <= 30),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, day)
);

-- ============================================================
-- 3.2: notes 테이블 (학습 노트)
-- ============================================================
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day INTEGER NOT NULL CHECK (day >= 1 AND day <= 30),
  content TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, day)
);

-- ============================================================
-- 3.3: milestones 테이블 (마일스톤 달성 기록)
-- ============================================================
CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  milestone_percent INTEGER NOT NULL CHECK (milestone_percent IN (25, 50, 75, 100)),
  shown_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, milestone_percent)
);

-- ============================================================
-- 3.4: RLS 활성화
-- ============================================================
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 3.5: RLS 정책 (성능 최적화: (select auth.uid()) 래핑 + TO authenticated)
-- ============================================================

-- progress 정책
CREATE POLICY "select own progress" ON progress
  FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "insert own progress" ON progress
  FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "update own progress" ON progress
  FOR UPDATE TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "delete own progress" ON progress
  FOR DELETE TO authenticated
  USING ((select auth.uid()) = user_id);

-- notes 정책
CREATE POLICY "select own notes" ON notes
  FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "insert own notes" ON notes
  FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "update own notes" ON notes
  FOR UPDATE TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "delete own notes" ON notes
  FOR DELETE TO authenticated
  USING ((select auth.uid()) = user_id);

-- milestones 정책
CREATE POLICY "select own milestones" ON milestones
  FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "insert own milestones" ON milestones
  FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "update own milestones" ON milestones
  FOR UPDATE TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "delete own milestones" ON milestones
  FOR DELETE TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================
-- 3.6: RLS 성능 인덱스
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_milestones_user_id ON milestones USING btree (user_id);
