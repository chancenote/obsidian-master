## Why

현재 Obsidian Master 사이트는 vanilla HTML/JS/CSS 정적 PWA로, 모든 사용자 데이터를 브라우저 localStorage에 저장한다. 기기 간 동기화가 불가능하고, 브라우저 데이터 삭제 시 학습 기록이 영구 소실된다.

이번 변경에서 전체 프론트엔드를 Next.js(App Router)로 재작성하고, Supabase를 백엔드(Auth + DB)로 도입한다. 사용자가 회원가입/로그인하여 진행 상황을 안전하게 보관하고, 어떤 기기에서든 이어서 학습할 수 있게 한다. Vercel에 배포하여 SSR 기반 인증과 서버 컴포넌트의 이점을 활용한다.

## What Changes

- **신규**: Next.js App Router 프로젝트로 전체 프론트엔드 재작성 (React 컴포넌트 기반)
- **신규**: Supabase Auth(이메일/비밀번호)를 통한 회원가입/로그인/로그아웃 + 미들웨어 기반 세션 관리
- **신규**: Supabase Database에 사용자별 진행도, 학습 노트, 마일스톤 저장 (RLS 적용)
- **신규**: Vercel 배포 (Supabase Marketplace 연동으로 env 자동 동기화)
- **재사용**: 기존 커리큘럼 데이터(`CURRICULUM`, `DAY_META`, `ACHIEVEMENTS_DATA` 등)를 TypeScript로 마이그레이션
- **폐기**: 기존 vanilla JS(`app.js`, `index.html`, `styles.css`), GitHub Pages 배포, Service Worker PWA

## Capabilities

### New Capabilities

- `user-auth`: Supabase Auth 기반 회원가입, 로그인, 로그아웃. `@supabase/ssr` + Next.js 미들웨어로 쿠키 기반 세션 관리. 이메일/비밀번호 인증. 서버 컴포넌트에서 인증 상태 접근.
- `progress-storage`: 사용자별 진행도(`progress`), 학습 노트(`notes`), 마일스톤(`milestones`)을 Supabase DB에 CRUD. Server Actions를 통한 데이터 변경. RLS로 사용자 간 데이터 격리.

### Modified Capabilities

(기존 specs 없음 — 수정 대상 없음)

## Impact

- **프론트엔드**: 전체 재작성. vanilla JS → Next.js App Router + React + TypeScript
- **신규 의존성**: `next`, `react`, `@supabase/supabase-js`, `@supabase/ssr`, `tailwindcss` (또는 기존 CSS 재사용)
- **인프라**: Supabase 프로젝트 생성, DB 테이블 3개 (progress, notes, milestones) + RLS 정책
- **배포**: GitHub Pages → Vercel. Supabase Marketplace 연동으로 환경변수 자동 주입.
- **데이터 마이그레이션**: 커리큘럼 정적 데이터(`curriculum-data.js`)를 TypeScript 모듈로 변환. 사용자 데이터는 신규 DB에서 새로 시작.
- **폐기 대상**: `app.js`, `index.html`, `styles.css`, `sw.js`, `manifest.json`, GitHub Pages 워크플로우
