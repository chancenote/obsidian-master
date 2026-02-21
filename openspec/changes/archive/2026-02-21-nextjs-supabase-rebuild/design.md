## Context

Obsidian Master는 30일 옵시디언 학습 커리큘럼 트래커다. 현재 vanilla HTML/JS/CSS(빌드 도구 없음)로 GitHub Pages에 정적 호스팅되어 있다. 모든 사용자 데이터(진행도, 노트, 마일스톤)는 localStorage에 저장되며, `app.js`(685줄)에 데이터 레이어와 UI 렌더링이 혼재되어 있다.

이번 변경에서 Next.js App Router + Supabase로 전체 재작성하고 Vercel에 배포한다. 기존 커리큘럼 정적 데이터만 재사용하고, 나머지는 새로 구축한다.

## Goals / Non-Goals

**Goals:**

- Next.js App Router + TypeScript로 현대적 프론트엔드 구축
- `@supabase/ssr`로 쿠키 기반 SSR 인증 (이메일/비밀번호)
- Supabase DB에 사용자별 progress, notes, milestones CRUD
- RLS로 사용자 간 데이터 격리
- Vercel 배포 + Supabase Marketplace 연동

**Non-Goals:**

- OAuth 소셜 로그인 (추후 확장 가능)
- Realtime subscriptions (단순 CRUD로 충분)
- 기존 vanilla JS 코드베이스 유지 (완전 재작성)
- 모바일 네이티브 앱
- 관리자 대시보드

## Decisions

### 1. 프로젝트 부트스트래핑: `create-next-app -e with-supabase`

**선택**: Supabase 공식 Next.js 스타터 템플릿 사용

```bash
npx create-next-app -e with-supabase obsidian-master
```

**이유**: `@supabase/ssr` 설정, 미들웨어, 이중 클라이언트 패턴, 환경변수 구조가 미리 구성됨. 직접 설정하면 미들웨어 쿠키 동기화 같은 미묘한 부분에서 실수하기 쉽다.

**대안 검토**:
- 빈 `create-next-app` + 수동 Supabase 설정 — 보일러플레이트 많고 에러 프론 가능
- 기존 프로젝트에 Next.js 추가 — 구조가 완전히 다르므로 새 프로젝트가 깔끔

### 2. Supabase 클라이언트 아키텍처: 이중 클라이언트 패턴

```
lib/supabase/
├── client.ts    → createBrowserClient()   — 클라이언트 컴포넌트 전용
├── server.ts    → createServerClient()    — 서버 컴포넌트, Server Actions, Route Handlers
└── proxy.ts     → updateSession()         — 미들웨어 세션 갱신 로직
```

**`client.ts`** (브라우저):
- `createBrowserClient(URL, ANON_KEY)` — 동기 함수
- `'use client'` 컴포넌트에서 사용 (인증 상태 확인, 클라이언트측 인터랙션)
- 세션을 쿠키에 자동 저장
- 미인증 사용자의 localStorage 폴백에도 인증 상태 판단용으로 사용

**`server.ts`** (서버):
- `createServerClient(URL, ANON_KEY, { cookies })` — async 함수 (`await cookies()` 필요)
- 서버 컴포넌트에서 데이터 조회, Server Actions에서 데이터 변경
- `setAll`에 `try/catch` — 서버 컴포넌트는 쿠키 쓰기 불가, 미들웨어가 처리

**대안 검토**:
- 단일 클라이언트 — 서버/브라우저 환경이 달라 쿠키 접근 방식이 다름. 불가능.
- `@supabase/auth-helpers-nextjs` — deprecated. `@supabase/ssr`로 대체됨.

### 3. 미들웨어: 세션 갱신 전용 (리다이렉트 없음)

**`proxy.ts`** (루트):
```
매 요청 → updateSession() → getClaims()로 JWT 검증(로컬, 네트워크 불필요)
→ 인증됨 → 쿠키에 갱신된 토큰 설정 → 통과
→ 미인증 → 세션 없이 통과 (리다이렉트 하지 않음)
```

**중요**: 모든 학습 페이지(`/`, `/curriculum`, `/youtube`)는 퍼블릭이다. 미들웨어는 세션 갱신만 담당하고, 미인증 사용자를 리다이렉트하지 않는다. 비로그인 사용자도 localStorage 기반으로 사이트를 이용할 수 있어야 한다.

**matcher 설정** (정적 에셋 제외):
```typescript
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

**인증 검증 메서드 선택**:
| 메서드 | 위치 | 네트워크 | 용도 |
|--------|------|----------|------|
| `getClaims()` | 미들웨어 | 없음 (로컬 JWT) | 세션 갱신, 리다이렉트 판단 |
| `getUser()` | 서버 컴포넌트 | 있음 (auth 서버) | 민감 데이터 접근 전 검증 |
| `getSession()` | ❌ 서버 금지 | 없음 | 위변조 가능, 클라이언트에서만 |

### 4. 서버/클라이언트 컴포넌트 경계 설계

App Router에서 모든 컴포넌트는 기본적으로 서버 컴포넌트다. `'use client'`가 필요한 부분을 최소화하여 리프 노드로 밀어낸다.

```
app/
├── layout.tsx              ← 서버 (인증 상태 조회, 네비게이션 렌더)
├── page.tsx                ← 서버 (대시보드 — 진행도 데이터 fetch)
├── login/
│   ├── page.tsx            ← 서버 (폼 껍데기)
│   └── actions.ts          ← 서버 액션 (signIn, signUp)
├── curriculum/
│   ├── page.tsx            ← 서버 (커리큘럼 데이터 fetch + 렌더)
│   └── components/
│       ├── DayCheckbox.tsx  ← 'use client' (클릭 이벤트 → toggleDay)
│       └── NoteEditor.tsx   ← 'use client' (textarea 입력 → saveNote)
├── calendar/
│   ├── page.tsx            ← 서버 (달력 그리드 렌더)
│   └── components/
│       └── CalendarDay.tsx  ← 'use client' (클릭 이벤트 → toggleDay)
└── components/
    ├── Header.tsx          ← 서버 (인증 상태 표시)
    ├── AuthButton.tsx      ← 'use client' (로그인/로그아웃 버튼 인터랙션)
    ├── StatsBar.tsx        ← 서버 (통계 표시, 데이터 fetch)
    ├── Achievements.tsx    ← 서버 (배지 렌더)
    └── CelebrationOverlay.tsx ← 'use client' (confetti 애니메이션, DOM 조작)
```

**원칙**:
- 데이터 fetch → 서버 컴포넌트 (Supabase server client) — 인증 사용자
- 이벤트 핸들러 (click, input, keydown) → `'use client'` 컴포넌트
- DOM 직접 조작 (confetti, 모달 토글) → `'use client'` 컴포넌트
- `'use client'`는 컴포넌트 트리의 리프 노드로 최대한 밀어내어 서버 렌더링 범위를 최대화
- 미인증 사용자의 localStorage 접근 → `'use client'` 컴포넌트 (브라우저 API)

### 5. 데이터 접근 패턴: Storage Adapter (인증 상태 분기)

**핵심**: 인증 상태에 따라 데이터 소스를 자동 분기하는 어댑터 패턴.

```
┌──────────────────────────────────┐
│ 서버 컴포넌트 (page.tsx)          │
│ → 인증 확인: user = getUser()     │
│ → user 있음: Supabase에서 fetch   │
│ → user 없음: 빈 데이터 전달       │
└────────────┬─────────────────────┘
             │ props (progress, notes, user)
┌────────────┴─────────────────────┐
│ 클라이언트 컴포넌트 ('use client') │
│ → user 있음: Server Action 호출   │
│ → user 없음: localStorage 직접    │
└──────────────────────────────────┘
```

**인증 사용자 조회 (읽기)** — 서버 컴포넌트:
```typescript
// app/page.tsx (서버 컴포넌트)
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()

let progress = {}
if (user) {
  const { data } = await supabase.from('progress').select('*').eq('user_id', user.id)
  progress = data
}
// user와 progress를 클라이언트 컴포넌트에 props로 전달
```

**인증 사용자 변경 (쓰기)** — Server Actions:
```typescript
// app/actions/progress.ts
'use server'
export async function toggleDay(day: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }
  // upsert or delete...
  revalidatePath('/')
}
```

**미인증 사용자** — 클라이언트 컴포넌트에서 localStorage 직접 사용:
```typescript
// components/DayCheckbox.tsx
'use client'
import { toggleDay as serverToggle } from '@/app/actions/progress'

export function DayCheckbox({ day, checked, user }: Props) {
  const handleClick = async () => {
    if (user) {
      await serverToggle(day)        // → Supabase via Server Action
    } else {
      toggleDayLocal(day)            // → localStorage 직접
    }
  }
  return <button onClick={handleClick}>...</button>
}
```

**대안 검토**:
- API Routes (`/api/progress`) — Server Actions이 더 간결하고 타입 안전. API Routes는 외부 클라이언트가 필요할 때만.
- 클라이언트에서 항상 Supabase 직접 호출 — 미인증 사용자 분기가 여전히 필요하므로 복잡도 동일. SSR 이점을 잃음.

### 5-1. localStorage → Supabase 일회성 마이그레이션

**타이밍**: `onAuthStateChange`에서 `SIGNED_IN` 이벤트 감지 시 클라이언트 컴포넌트에서 1회 실행.

**로직**:
```
1. localStorage에 progress/notes/milestones 키가 있는지 확인
2. `obsidian-mastery-migrated` 플래그가 있으면 스킵
3. Supabase에 해당 유저 데이터가 이미 있는지 확인
4. 로컬만 있음 → 자동 UPSERT → 성공 토스트
5. 양쪽 다 있음 → 사용자 선택 프롬프트 ("서버 유지" vs "로컬로 덮어쓰기")
6. 완료 후 localStorage에 `obsidian-mastery-migrated` 플래그 설정
```

### 6. DB 스키마: 3 테이블, `auth.uid()` 직접 참조

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

별도 `profiles` 테이블 불필요 — 추가 사용자 메타데이터 없음.

### 7. RLS 정책: 성능 최적화 적용

```sql
-- 모든 테이블에 동일 패턴 (progress, notes, milestones)
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select own" ON progress FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);
CREATE POLICY "insert own" ON progress FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "update own" ON progress FOR UPDATE TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "delete own" ON progress FOR DELETE TO authenticated
  USING ((select auth.uid()) = user_id);

-- RLS 성능 인덱스
CREATE INDEX idx_progress_user_id ON progress USING btree (user_id);
```

**최적화 포인트**:
- `(select auth.uid())` 래핑 → Postgres initPlan 캐싱 (95-99% 쿼리 시간 감소)
- `TO authenticated` → anon 요청 정책 평가 스킵
- `user_id` btree 인덱스 → UNIQUE 제약조건과 별도로 RLS 단독 쿼리용
- 클라이언트 쿼리에서도 `.eq('user_id', userId)` 명시 → Postgres 플래너 최적화

### 8. 커리큘럼 데이터 마이그레이션

기존 `curriculum-data.js`의 전역 변수들을 TypeScript 모듈로 변환:

```
lib/data/
├── curriculum.ts     ← CURRICULUM, WEEK_OBJECTIVES 배열
├── day-meta.ts       ← DAY_META 객체
├── achievements.ts   ← ACHIEVEMENTS_DATA 배열
└── youtube.ts        ← YOUTUBE_DATA 객체
```

타입 정의:
```typescript
export interface Day { day: number; title: string; summary: string; details: string[]; tags: string[]; practice?: string; prompt?: string; }
export interface Week { week: number; title: string; description: string; days: Day[]; }
```

서버 컴포넌트에서 직접 import하여 빌드 타임에 인라인. DB에 넣지 않는다 — 정적 콘텐츠이므로.

### 9. 라우팅 구조

```
app/
├── layout.tsx           ← 글로벌 레이아웃 (Header, 인증 상태)
├── page.tsx             ← 대시보드 (진행도 통계, 달력, 주간 개요)
├── login/
│   ├── page.tsx         ← 로그인/회원가입 폼
│   └── actions.ts       ← signIn, signUp Server Actions
├── curriculum/
│   └── page.tsx         ← 30일 커리큘럼 상세 + 학습 노트
├── youtube/
│   └── page.tsx         ← YouTube 가이드 (정적, 인증 불필요)
├── auth/
│   └── callback/
│       └── route.ts     ← OAuth 콜백 (이메일 확인 리다이렉트 처리)
└── actions/
    ├── progress.ts      ← toggleDay, resetProgress
    ├── notes.ts         ← saveNote, deleteNote
    └── milestones.ts    ← checkMilestone
```

기존 사이트의 탭 네비게이션(대시보드/커리큘럼/YouTube)을 Next.js 라우트로 자연스럽게 매핑.

### 10. 배포: Vercel + Supabase Marketplace

- `npx create-next-app -e with-supabase` → GitHub 레포 push → Vercel import
- Vercel Marketplace에서 Supabase 연동 → 환경변수 자동 주입
- Preview 배포마다 Supabase 환경 자동 연결
- 커스텀 도메인은 Vercel에서 설정

## Risks / Trade-offs

**[서버/클라이언트 컴포넌트 경계 혼동]** → `'use client'`를 컴포넌트 트리의 리프 노드로 밀어낸다. 이벤트 핸들러(click, input)와 DOM 직접 조작(confetti, 모달)만 클라이언트 컴포넌트로 분리. 데이터 fetch는 반드시 서버 컴포넌트에서. Decision #4에서 전체 컴포넌트 트리를 사전에 설계하여 경계를 명확히 한다.

**[미들웨어 불필요 실행으로 인한 지연]** → matcher 패턴으로 `_next/static`, `_next/image`, favicon, 이미지 확장자를 명시적으로 제외. Decision #3의 matcher 정규식이 정적 에셋을 빠짐없이 걸러낸다.

**[Supabase anon key 노출]** → 의도된 설계. `NEXT_PUBLIC_SUPABASE_ANON_KEY`는 클라이언트 노출용. RLS가 데이터를 보호. `SERVICE_ROLE_KEY`는 절대 `NEXT_PUBLIC_` 접두사 사용 금지.

**[이메일 인증 미완료 사용자]** → Supabase 기본 설정은 이메일 확인 필요. MVP에서는 "Confirm email" 비활성화 고려. 프로덕션에서는 활성화 + 확인 대기 UI 제공.

**[기존 URL 파괴]** → `chancenote.github.io/obsidian-master/`에서 Vercel 도메인으로 전환. 기존 GitHub Pages에 리다이렉트 메타 태그 또는 JS 리다이렉트를 배치하여 기존 방문자를 안내.

**[Server Actions 지연 (낙관적 UI)]** → `toggleDay` 같은 빈번한 액션은 클라이언트에서 낙관적 업데이트(optimistic update) 적용 후 Server Action 결과로 확정. `useOptimistic` 또는 `startTransition` 활용.

## Open Questions

- **스타일링**: 기존 CSS를 Tailwind로 전환할지, CSS Modules로 마이그레이션할지, 또는 기존 CSS를 글로벌로 그대로 가져올지
- **이메일 인증**: MVP에서 이메일 확인을 비활성화할지, 처음부터 활성화할지
- **커스텀 도메인**: 새 Vercel 도메인을 사용할지, 기존 도메인을 연결할지
