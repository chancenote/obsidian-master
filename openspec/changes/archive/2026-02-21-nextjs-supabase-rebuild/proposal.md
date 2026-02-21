## Why

현재 Obsidian Master 사이트는 vanilla HTML/JS/CSS 정적 PWA로, 모든 사용자 데이터를 브라우저 localStorage에 저장한다. 기기 간 동기화가 불가능하고, 브라우저 데이터 삭제 시 학습 기록이 영구 소실된다.

전체 프론트엔드를 Next.js App Router로 재작성하고, Supabase(Auth + DB)를 백엔드로 도입한다. 사용자가 회원가입/로그인하여 진행 상황을 서버에 안전하게 보관하고, 어떤 기기에서든 이어서 학습할 수 있게 한다.

## What Changes

- **신규**: Next.js App Router 프로젝트로 전체 프론트엔드 재작성 (React + TypeScript)
- **신규**: Supabase Auth — 이메일/비밀번호 회원가입, 로그인, 로그아웃. `@supabase/ssr` + Next.js 미들웨어로 쿠키 기반 세션 관리.
- **신규**: Supabase Database — 사용자별 진행도, 학습 노트, 마일스톤을 DB에 저장. Server Actions로 데이터 변경. RLS로 사용자 간 격리.
- **신규**: Vercel 배포. Supabase Marketplace 연동으로 환경변수 자동 동기화.
- **재사용**: 기존 커리큘럼 정적 데이터(`CURRICULUM`, `DAY_META`, `ACHIEVEMENTS_DATA`, `YOUTUBE_DATA`)를 TypeScript 모듈로 마이그레이션.
- **유지**: 비로그인 사용자는 기존처럼 localStorage 기반으로 학습 가능 (하위 호환). 로그인 유도 배너 표시.
- **신규**: 최초 로그인 시 localStorage 기존 데이터를 Supabase로 일회성 마이그레이션 (충돌 시 사용자 선택)
- **BREAKING**: 기존 vanilla JS 코드베이스(`app.js`, `index.html`, `styles.css`)와 GitHub Pages 배포를 대체. 기존 URL(`chancenote.github.io/obsidian-master/`)은 새 Vercel 도메인으로 전환되거나 리다이렉트 필요.

## Capabilities

### New Capabilities

- `user-auth`: Supabase Auth 기반 인증 전체 흐름. 이메일/비밀번호 회원가입·로그인·로그아웃. `@supabase/ssr`로 쿠키 기반 세션. Next.js 미들웨어(`proxy.ts`)에서 매 요청마다 JWT 갱신 및 미인증 사용자 리다이렉트. Server Actions로 auth 뮤테이션 처리.
- `progress-storage`: Supabase DB에 사용자별 학습 데이터 CRUD. 테이블 3개(`progress`, `notes`, `milestones`). `UNIQUE(user_id, day)` 제약조건으로 UPSERT 지원. RLS 정책(`(select auth.uid()) = user_id`)으로 데이터 격리. Server Actions로 변경, 서버 컴포넌트에서 조회.

### Modified Capabilities

(기존 specs 없음 — 수정 대상 없음)

## Impact

- **프론트엔드**: 전체 재작성. vanilla JS(685줄 `app.js`) → Next.js App Router + React + TypeScript
- **신규 의존성**: `next`, `react`, `@supabase/supabase-js`, `@supabase/ssr`, `tailwindcss`
- **인프라**: Supabase 프로젝트 생성. DB 테이블 3개 + RLS 정책 + btree 인덱스. 환경변수(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`)
- **배포**: GitHub Pages → Vercel. Supabase Marketplace 연동. Preview 배포에서도 Supabase 환경 자동 연결.
- **데이터**: 커리큘럼 정적 데이터(`curriculum-data.js`)를 TypeScript 모듈로 변환. 사용자 런타임 데이터는 DB에 새로 축적.
- **폐기 대상**: `app.js`, `index.html`, `styles.css`, `sw.js`, `manifest.json`, `curriculum-data.js`(TS로 대체)
