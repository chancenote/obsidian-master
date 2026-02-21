## 1. Project Setup

- [x] 1.1 Bootstrap Next.js project: `npx create-next-app -e with-supabase obsidian-master`
- [x] 1.2 Verify starter template structure: `lib/supabase/client.ts`, `lib/supabase/server.ts`, `proxy.ts` (middleware) exist
- [x] 1.3 Configure `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [x] 1.4 Remove starter template boilerplate pages (keep Supabase lib and middleware)
- [x] 1.5 Set up project directory structure per design Decision #9 (app/, lib/, components/)

## 2. Static Data Migration (curriculum-data.js → TypeScript)

- [x] 2.1 Create `lib/data/types.ts` with `Day`, `Week`, `DayMeta`, `Achievement` interfaces
- [x] 2.2 Convert `CURRICULUM` and `WEEK_OBJECTIVES` to `lib/data/curriculum.ts`
- [x] 2.3 Convert `DAY_META` to `lib/data/day-meta.ts`
- [x] 2.4 Convert `ACHIEVEMENTS_DATA` to `lib/data/achievements.ts`
- [x] 2.5 Convert `YOUTUBE_DATA` to `lib/data/youtube.ts`
- [x] 2.6 Verify all data imports compile and match original data

## 3. Supabase Database Setup

- [x] 3.1 Create `progress` table with schema from design Decision #6 (id, user_id, day, completed_at, UNIQUE(user_id, day))
- [x] 3.2 Create `notes` table (id, user_id, day, content, updated_at, UNIQUE(user_id, day))
- [x] 3.3 Create `milestones` table (id, user_id, milestone_percent, shown_at, UNIQUE(user_id, milestone_percent))
- [x] 3.4 Enable RLS on all three tables
- [x] 3.5 Create RLS policies (SELECT/INSERT/UPDATE/DELETE) with `(select auth.uid()) = user_id` and `TO authenticated` per design Decision #7
- [x] 3.6 Create btree indexes: `idx_progress_user_id`, `idx_notes_user_id`, `idx_milestones_user_id`
- [ ] 3.7 Verify RLS works: test with authenticated user (data visible) and anon request (empty result)

## 4. Middleware Configuration

- [x] 4.1 Modify `proxy.ts` to session-refresh-only mode (remove any redirect logic from starter template)
- [x] 4.2 Configure matcher to exclude static assets: `/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)`
- [x] 4.3 Use `getClaims()` for JWT validation (no `getUser()` in middleware — no network call)
- [x] 4.4 Verify middleware passes through unauthenticated requests without redirect

## 5. Auth Implementation

- [x] 5.1 Create `/login/page.tsx` — server component with sign-in/sign-up form shell (Suspense pattern for Next.js 16)
- [x] 5.2 Create `/login/actions.ts` — Server Actions: `signIn` (signInWithPassword) and `signUp` (signUp), both redirect to `/` on success
- [x] 5.3 Implement client-side tab toggle between sign-in and sign-up modes (LoginForm `'use client'` component)
- [x] 5.4 Add form validation: email format, password 6+ characters (client-side before Server Action)
- [x] 5.5 Display Supabase error messages on form (existing email, wrong credentials, etc.)
- [x] 5.6 Create `/auth/callback/route.ts` — handle email confirmation redirect (exchange code for session)
- [x] 5.7 Implement sign-out Server Action in `actions/auth.ts`
- [ ] 5.8 Verify full auth flow: sign-up → email confirm (if enabled) → sign-in → sign-out

## 6. Shared Components

- [x] 6.1 Create `components/Header.tsx` (server) — render app title, navigation links (대시보드, 커리큘럼, YouTube)
- [x] 6.2 Create `components/AuthButton.tsx` (`'use client'`) — show user email + "로그아웃" when authenticated, "로그인" link when not
- [x] 6.3 Create `components/LoginBanner.tsx` (`'use client'`) — "로그인하면 진도를 서버에 동기화할 수 있어요" banner for unauthenticated users, dismissible (localStorage flag)
- [x] 6.4 Create `components/CelebrationOverlay.tsx` (`'use client'`) — confetti animation + milestone message
- [x] 6.5 Create `app/layout.tsx` — global layout with Header, pass auth state to AuthButton (Suspense wrapped)
- [x] 6.6 Add navigation between routes (대시보드 `/`, 커리큘럼 `/curriculum`, YouTube `/youtube`)

## 7. Storage Adapter & Data Layer

- [x] 7.1 Create `lib/storage/local.ts` — localStorage adapter: `loadProgress()`, `saveProgress()`, `loadNotes()`, `saveNote()`, `loadMilestones()`, `saveMilestone()` (same key format as original app)
- [x] 7.2 Create `app/actions/progress.ts` — Server Actions: `toggleDay(day)`, `resetProgress()`
- [x] 7.3 Create `app/actions/notes.ts` — Server Actions: `saveNote(day, content)`, `deleteNote(day)`
- [x] 7.4 Create `app/actions/milestones.ts` — Server Action: `checkMilestone(percent)`
- [x] 7.5 Each Server Action: verify user with `getUser()`, return `{ error }` if not authenticated
- [x] 7.6 Create `lib/storage/helpers.ts` — shared computation functions: `getStreak(progress)`, `getCompletionPercent(progress)`, `getNoteCount(notes)`

## 8. Dashboard Page (/)

- [x] 8.1 Create `app/page.tsx` (server) — fetch progress/milestones from Supabase if authenticated, pass `user` + `progress` as props
- [x] 8.2 Create `components/StatsBar.tsx` (server for auth, client for unauth) — completed count, percentage, current week, streak
- [x] 8.3 Create `components/CalendarGrid.tsx` (`'use client'`) — 30-day calendar with completion styling, click → `toggleDay`
- [x] 8.4 Render individual day cells in `CalendarGrid.tsx` — day toggle dispatches to Server Action or localStorage based on `user` prop
- [x] 8.5 Create `components/WeeklyOverview.tsx` (`'use client'`) — collapsible week sections, progress bars, day checkboxes
- [x] 8.6 Create `components/Achievements.tsx` — badge grid computed from progress data
- [x] 8.7 Wire milestone checking: after toggleDay, check if new milestone reached → trigger celebration overlay

## 9. Curriculum Page (/curriculum)

- [x] 9.1 Create `app/curriculum/page.tsx` (server) — fetch notes from Supabase if authenticated, render curriculum data from `lib/data/curriculum.ts`
- [x] 9.2 Create `curriculum/components/DayCheckbox.tsx` (`'use client'`) — completion toggle per day, dispatches to Server Action or localStorage
- [x] 9.3 Create `curriculum/components/NoteEditor.tsx` (`'use client'`) — textarea with 500ms debounce, dispatches to Server Action or localStorage
- [x] 9.4 Render practice boxes and Claude prompt buttons per day (from static curriculum data)
- [x] 9.5 Render plugin roadmap section and weekly learning objectives

## 10. YouTube Page (/youtube)

- [x] 10.1 Create `app/youtube/page.tsx` (server) — render YouTube guide from `lib/data/youtube.ts`
- [x] 10.2 Render Korean/International video sections with YouTube search links
- [x] 10.3 Render community resources section (forum, Reddit, Discord, newsletter)

## 11. Data Migration (localStorage → Supabase)

- [x] 11.1 Create `components/MigrationHandler.tsx` (`'use client'`) — listens to `onAuthStateChange` for `SIGNED_IN` event
- [x] 11.2 Implement migration detection: check localStorage keys exist AND `obsidian-mastery-migrated` flag absent
- [x] 11.3 Implement auto-migration: when local data exists + no server data → UPSERT all → success toast
- [x] 11.4 Implement conflict resolution UI: when both local + server data exist → prompt user ("서버 데이터 유지" vs "로컬 데이터로 덮어쓰기")
- [x] 11.5 Set `obsidian-mastery-migrated` flag in localStorage after migration completes
- [x] 11.6 Skip migration silently when localStorage is empty

## 12. Data Export/Import

- [x] 12.1 Implement export for authenticated users: fetch from Supabase tables → download JSON
- [x] 12.2 Implement export for unauthenticated users: read from localStorage → download JSON
- [x] 12.3 JSON format: `{ version: 2, exportedAt, progress: [...], notes: [...], milestones: [...] }`

## 13. Styling

- [x] 13.1 Decide styling approach: Tailwind (starter includes it) or migrate existing CSS
- [x] 13.2 Implement global layout styles (dark theme matching original site)
- [x] 13.3 Style login page (form, tabs, error messages)
- [x] 13.4 Style dashboard (stats bar, calendar grid, weekly overview, achievements)
- [x] 13.5 Style curriculum page (day details, note editor, practice boxes, tags)
- [x] 13.6 Style YouTube page (video sections, community resources)
- [x] 13.7 Style login prompt banner and celebration overlay
- [x] 13.8 Responsive design: mobile-first, matching original breakpoints

## 14. Deployment & Verification

- [ ] 14.1 Push to GitHub repository
- [ ] 14.2 Import project in Vercel, connect Supabase via Marketplace integration
- [ ] 14.3 Verify environment variables auto-injected (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- [ ] 14.4 Test full flow on preview deployment: unauthenticated localStorage usage → sign-up → migration → authenticated Supabase usage
- [ ] 14.5 Test cross-device sync: sign in on two devices, toggle day on one, verify on other
- [ ] 14.6 Test RLS: verify users cannot access each other's data
- [ ] 14.7 Set up old GitHub Pages redirect to new Vercel URL (if applicable)
- [ ] 14.8 Configure custom domain on Vercel (if applicable)
