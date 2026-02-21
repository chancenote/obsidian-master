## Context

Obsidian Master는 GitHub Pages에서 호스팅되는 정적 PWA(vanilla HTML/JS/CSS, 빌드 도구 없음)다. 현재 4개의 localStorage 키로 모든 사용자 데이터를 관리한다:

- `obsidian-mastery-progress`: `{ [day: number]: ISO_timestamp }` — 30일 완료 상태
- `obsidian-mastery-notes`: `{ [day: number]: string }` — 일별 학습 노트
- `obsidian-mastery-milestones`: `number[]` — 표시된 마일스톤 퍼센트
- `obsidian-mastery-onboarded`: `"1"` — 온보딩 플래그 (기기별, 마이그레이션 대상 아님)

`app.js`(685줄)에 데이터 레이어와 UI 렌더링이 혼재되어 있으며, 모든 I/O가 동기식이다.

## Goals / Non-Goals

**Goals:**

- Supabase Auth(이메일/비밀번호)로 회원가입/로그인/로그아웃 구현
- 로그인 사용자의 progress, notes, milestones를 Supabase DB에 저장
- 비로그인 사용자는 기존 localStorage 방식 그대로 유지 (하위 호환)
- 최초 로그인 시 localStorage 기존 데이터를 서버로 일회성 마이그레이션
- RLS로 사용자 간 데이터 격리 보장

**Non-Goals:**

- OAuth 소셜 로그인 (이메일/비밀번호만 — 추후 확장 가능)
- 실시간 동기화 / Realtime subscriptions (단순 CRUD로 충분)
- 오프라인 우선(offline-first) 아키텍처 (PWA 캐싱은 기존 SW가 처리)
- 별도 프로필 페이지 / 사용자 프로필 테이블 (불필요)
- 빌드 도구 도입 (현재 번들러 없는 구조 유지)

## Decisions

### 1. Supabase Client 로드 방식: CDN UMD `<script>` 태그

**선택**: `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>` (UMD 빌드)

**주의**: `jsdelivr +esm` 변형(`/+esm` 접미사)은 Supabase v2에서 깨져있음 (supabase/discussions#41118 확인된 버그 — `default null` export 문제로 런타임 크래시). 반드시 UMD 빌드(접미사 없음)를 사용해야 한다.

**대안 검토**:
- ES Module via `esm.sh` (`import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'`) — 동작하지만 `<script type="module">` 필요. 기존 `app.js`가 전역 스코프 함수로 작성되어 있어 전면 리팩터 필요.
- npm install + 번들러 — Non-Goal에서 명시적으로 제외

**이유**: 기존 `<script>` 기반 구조와 호환. `const { createClient } = supabase`로 전역 접근. 변경 범위 최소화.

### 2. 데이터 레이어 패턴: Storage Adapter

**선택**: 로그인 상태에 따라 Supabase 또는 localStorage를 선택하는 어댑터 패턴

```
┌──────────────┐
│   UI Layer   │  (renderCalendar, renderWeeks, toggleDay 등)
│  app.js      │  변경 없음 — 기존 함수 시그니처 유지
└──────┬───────┘
       │ loadProgress(), saveProgress(), loadNotes(), saveNote(), ...
┌──────┴───────┐
│ Storage      │  ← 새로 추가되는 계층
│ Adapter      │  isLoggedIn() ? supabaseStorage : localStorageAdapter
└──┬────────┬──┘
   │        │
┌──┴──┐  ┌──┴──────────┐
│local│  │ Supabase    │
│Store│  │ Client      │
└─────┘  └─────────────┘
```

**핵심**: 기존 `loadProgress()`, `saveProgress()` 등의 함수 시그니처는 변경하지 않는다. 내부 구현만 어댑터로 교체한다. 다만 Supabase 호출은 비동기(async)이므로 기존 동기 함수를 `async`로 전환하고, 호출부에 `await`를 추가해야 한다.

**대안 검토**:
- 모든 함수를 인라인 수정 — 분기 로직이 각 함수마다 산재되어 유지보수 어려움
- 별도 `supabase-storage.js` 모듈 — 이것을 채택. 어댑터를 별도 파일로 분리

### 3. DB 스키마: 3 테이블, auth.uid() 직접 참조

**선택**: `progress`, `notes`, `milestones` 테이블. `user_id`는 Supabase Auth의 `auth.uid()` UUID를 직접 사용.

```sql
CREATE TABLE progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day INTEGER NOT NULL CHECK (day >= 1 AND day <= 30),
  completed_at TIMESTAMPTZ NOT NULL,
  UNIQUE(user_id, day)
);

CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day INTEGER NOT NULL CHECK (day >= 1 AND day <= 30),
  content TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, day)
);

CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  milestone_percent INTEGER NOT NULL CHECK (milestone_percent IN (25, 50, 75, 100)),
  shown_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, milestone_percent)
);
```

**대안 검토**:
- 별도 `profiles` 테이블 생성 — 현재 추가 프로필 데이터 없으므로 불필요. YAGNI.
- 단일 `user_data` JSONB 컬럼 — 쿼리 유연성이 떨어지고, 부분 업데이트가 번거로움

**이유**: 각 데이터 유형이 독립적 CRUD 패턴을 가짐. `UNIQUE(user_id, day)` 제약조건으로 UPSERT 자연스럽게 지원.

### 4. RLS 정책: 사용자 본인 데이터만 접근

```sql
-- 모든 테이블에 동일 패턴 적용 (progress, notes, milestones)
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "progress: select own" ON progress
  FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "progress: insert own" ON progress
  FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "progress: update own" ON progress
  FOR UPDATE TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "progress: delete own" ON progress
  FOR DELETE TO authenticated
  USING ((select auth.uid()) = user_id);

-- user_id 인덱스 (RLS 성능 최적화 — 쿼리 시간 95-99% 감소)
CREATE INDEX idx_progress_user_id ON progress USING btree (user_id);
-- notes, milestones에도 동일 적용
```

**핵심 최적화**:
- `(select auth.uid())` 래핑: Postgres initPlan 캐싱으로 행당 재평가 방지 (179ms → 9ms)
- `TO authenticated`: anon 요청에 대한 불필요한 정책 평가 방지
- `user_id` btree 인덱스: UNIQUE 제약조건과 별도로 RLS 정책 평가용 단독 인덱스 필요
- 클라이언트 쿼리에서도 `.eq('user_id', userId)` 명시 — RLS와 중복이지만 Postgres 쿼리 플래너 최적화에 도움

**이유**: 단순한 user-owns-rows 모델. Supabase anon key가 클라이언트에 노출되어도 RLS가 데이터를 보호.

### 5. Auth UI: 커스텀 모달 (라이브러리 없음)

**선택**: `index.html`에 로그인/회원가입 모달 추가. 기존 온보딩 오버레이와 동일한 패턴.

**흐름**:
1. 헤더에 "로그인" 버튼 표시 (비로그인 시) 또는 "이메일 + 로그아웃" (로그인 시)
2. 클릭 → 모달 오버레이 (회원가입/로그인 탭 전환)
3. 폼 제출 → `supabase.auth.signUp()` 또는 `supabase.auth.signInWithPassword()`
4. 성공 → 모달 닫기, UI 업데이트, 데이터 마이그레이션 트리거

**대안 검토**:
- `@supabase/auth-ui` 사용 — React 의존성 필요, vanilla JS와 비호환
- 별도 로그인 페이지 — SPA 구조에 맞지 않음, 현재 탭 기반 네비게이션 유지

### 6. localStorage → Supabase 마이그레이션 흐름

**타이밍**: `onAuthStateChange`에서 `SIGNED_IN` 이벤트 시 1회 실행

**로직**:
```
1. localStorage에 데이터가 있는지 확인
2. Supabase에 해당 유저 데이터가 이미 있는지 확인
3. localStorage 데이터 존재 + 서버 데이터 없음 → UPSERT로 마이그레이션
4. 양쪽 다 존재 → 사용자에게 선택 프롬프트 ("서버 데이터 유지" vs "로컬 데이터로 덮어쓰기")
5. 마이그레이션 완료 후 localStorage 데이터는 유지 (오프라인 캐시 역할)
```

**대안 검토**:
- 항상 서버 우선 — 기존 비로그인 사용자의 진행 데이터가 소실될 수 있음
- 항상 로컬 우선 — 다른 기기에서 로그인한 진행 데이터를 덮어씀

### 7. async 전환 전략

기존 `loadProgress()` 등은 동기 함수. Supabase 호출은 비동기. 전환 접근:

1. `app.js`의 데이터 함수를 `async`로 변경
2. 호출부(`toggleDay`, `renderAll`, `updateStats` 등)에 `await` 추가
3. 초기 로드(`renderAll()`)를 `async` IIFE로 래핑
4. 이벤트 핸들러에서 `async` 콜백 사용

**영향 범위**: `toggleDay`, `renderAll`, `renderCalendar`, `renderWeeks`, `renderCurriculum`, `updateStats`, `renderAchievements`, `exportData`, `importData`, `checkMilestones`

## Risks / Trade-offs

**[Supabase anon key 노출]** → RLS가 데이터를 보호. anon key는 클라이언트에 노출되도록 설계된 것. 추가로 `.env`가 아닌 JS 상수로 관리 (정적 사이트이므로 어차피 노출됨).

**[async 전환으로 인한 UI 깜빡임]** → 초기 로드 시 스켈레톤/로딩 상태 표시. 데이터 로드 완료 후 렌더링.

**[이메일 인증 미완료 사용자]** → Supabase 기본 설정은 이메일 확인 필요. 설정에서 "Confirm email" 비활성화하거나, 미인증 상태에서도 로그인 허용 여부 결정 필요.

**[localStorage ↔ Supabase 충돌]** → 마이그레이션 시 사용자 선택 프롬프트로 해결. 마이그레이션 후에는 Supabase가 single source of truth.

**[GitHub Pages CORS]** → Supabase는 기본적으로 모든 origin 허용. 추가 설정 불필요.

**[네트워크 오류 시 데이터 손실]** → Supabase 호출 실패 시 localStorage에 임시 저장 후 재시도 로직 (선택적 개선 사항, v1에서는 에러 토스트로 충분).
