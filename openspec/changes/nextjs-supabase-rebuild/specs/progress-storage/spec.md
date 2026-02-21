## ADDED Requirements

### Requirement: Storage adapter dispatches by auth state
The system SHALL use a storage adapter pattern that dispatches data operations based on authentication state. When the user is authenticated, all reads/writes go to Supabase DB (via server components and Server Actions). When unauthenticated, all reads/writes go to localStorage (client-side). The adapter MUST provide a consistent interface so UI components do not need to know the storage backend.

#### Scenario: Authenticated user data flows through Supabase
- **WHEN** authenticated user toggles a day or saves a note
- **THEN** system executes a Server Action that writes to Supabase DB

#### Scenario: Unauthenticated user data flows through localStorage
- **WHEN** unauthenticated user toggles a day or saves a note
- **THEN** system writes to localStorage using the existing key format (`obsidian-mastery-progress`, `obsidian-mastery-notes`, `obsidian-mastery-milestones`)

#### Scenario: Auth state change triggers data source switch
- **WHEN** user signs in (transitions from unauthenticated to authenticated)
- **THEN** system switches data source from localStorage to Supabase DB and triggers a re-render with server data

### Requirement: First login migrates localStorage data to server
The system SHALL detect when a newly authenticated user has existing localStorage data and offer to migrate it to Supabase. Migration SHALL run once per user, after the first successful sign-in or sign-up.

#### Scenario: Local data exists, no server data
- **WHEN** user signs in for the first time AND localStorage contains progress/notes/milestones data AND Supabase has no rows for this user
- **THEN** system automatically UPSERT all localStorage data into Supabase tables and displays a success toast "기존 학습 데이터가 서버에 동기화되었습니다"

#### Scenario: Local data exists, server data also exists (conflict)
- **WHEN** user signs in AND localStorage contains data AND Supabase already has rows for this user
- **THEN** system displays a prompt with two options: "서버 데이터 유지" (discard local) or "로컬 데이터로 덮어쓰기" (overwrite server with local). System executes the chosen option.

#### Scenario: No local data on sign-in
- **WHEN** user signs in AND localStorage is empty (no progress keys)
- **THEN** system skips migration silently and loads data from Supabase

#### Scenario: Migration completed flag
- **WHEN** migration completes (either auto-sync or user choice)
- **THEN** system sets a localStorage flag (`obsidian-mastery-migrated`) to prevent re-triggering on subsequent logins

### Requirement: User can toggle day completion
The system SHALL allow users to mark a day (1-30) as completed or uncompleted. For authenticated users, toggling SHALL upsert or delete a row in the `progress` table via a Server Action. For unauthenticated users, toggling SHALL update localStorage. The UI SHALL update after the action completes.

#### Scenario: Authenticated user marks day as completed
- **WHEN** authenticated user clicks an uncompleted day checkbox
- **THEN** system inserts a row `(user_id, day, completed_at=now())` into `progress` table and re-renders the page with the day marked complete

#### Scenario: Authenticated user unmarks day
- **WHEN** authenticated user clicks a completed day checkbox
- **THEN** system deletes the row matching `(user_id, day)` from `progress` table and re-renders the page with the day unmarked

#### Scenario: Unauthenticated user toggles day
- **WHEN** unauthenticated user clicks a day checkbox
- **THEN** system toggles the day in localStorage (`obsidian-mastery-progress`) and re-renders client-side

#### Scenario: Concurrent toggle from another device (authenticated)
- **WHEN** authenticated user toggles day 5 on device A, then reloads on device B
- **THEN** device B displays the updated state from the database

### Requirement: User can view progress statistics
The system SHALL display progress statistics on the dashboard: completed day count, completion percentage, current week, and streak count. For authenticated users, statistics SHALL be computed server-side from the `progress` table. For unauthenticated users, statistics SHALL be computed client-side from localStorage.

#### Scenario: Authenticated user dashboard stats
- **WHEN** authenticated user has completed days 1, 2, 3, 5
- **THEN** dashboard displays: completed=4, percentage=13%, streak=1 (day 5 only, gap at 4)

#### Scenario: Unauthenticated user dashboard stats
- **WHEN** unauthenticated user has completed days 1, 2 in localStorage
- **THEN** dashboard displays: completed=2, percentage=7%, streak=2

#### Scenario: Empty progress
- **WHEN** user (authenticated or unauthenticated) has no completed days
- **THEN** dashboard displays: completed=0, percentage=0%, streak=0

### Requirement: User can save learning notes per day
The system SHALL allow users to write and save a text note for each day (1-30). For authenticated users, saving SHALL upsert a row in the `notes` table via a Server Action. For unauthenticated users, saving SHALL write to localStorage. Notes SHALL be debounced on the client (500ms) before persisting.

#### Scenario: Save a new note
- **WHEN** authenticated user types text in the day 3 note textarea and stops typing for 500ms
- **THEN** system upserts a row `(user_id, day=3, content=text, updated_at=now())` into `notes` table

#### Scenario: Update existing note
- **WHEN** authenticated user modifies existing note for day 3
- **THEN** system upserts the row, updating `content` and `updated_at`

#### Scenario: Clear a note
- **WHEN** authenticated user clears the note textarea for day 3 (empty string)
- **THEN** system deletes the row matching `(user_id, day=3)` from `notes` table

### Requirement: User can view saved notes on curriculum page
The system SHALL display saved notes in the curriculum page's textarea for each day. Notes SHALL be fetched server-side from the `notes` table and passed to the client component.

#### Scenario: Notes pre-populated on load
- **WHEN** authenticated user navigates to `/curriculum` with saved notes for days 1, 3, 7
- **THEN** textareas for days 1, 3, 7 display their saved content; other textareas are empty

### Requirement: Milestones are tracked and celebrated
The system SHALL track milestone achievements (25%, 50%, 75%, 100% completion). When a user's progress reaches a milestone percentage for the first time, the system SHALL insert a row into the `milestones` table and trigger a celebration overlay (confetti animation). Milestones already shown (existing row in DB) SHALL NOT be shown again.

#### Scenario: First milestone reached
- **WHEN** authenticated user completes their 8th day (>25%) and no 25% milestone exists in DB
- **THEN** system inserts `(user_id, milestone_percent=25, shown_at=now())` and displays celebration overlay with message "25% 달성!"

#### Scenario: Milestone already shown
- **WHEN** authenticated user reloads after 25% milestone was already recorded
- **THEN** system does NOT display the celebration overlay for 25%

#### Scenario: 100% completion certificate
- **WHEN** authenticated user completes all 30 days and 100% milestone is recorded
- **THEN** system displays celebration overlay followed by a completion certificate modal

### Requirement: User can reset all progress
The system SHALL allow users to reset all their progress data. For authenticated users, reset SHALL delete all rows from `progress`, `notes`, and `milestones` tables via a Server Action. For unauthenticated users, reset SHALL clear localStorage keys. The system SHALL display a confirmation dialog before executing the reset.

#### Scenario: Authenticated confirm and reset
- **WHEN** authenticated user clicks "초기화" and confirms the dialog
- **THEN** system deletes all rows matching `user_id` from progress, notes, and milestones tables, then re-renders all pages

#### Scenario: Unauthenticated confirm and reset
- **WHEN** unauthenticated user clicks "초기화" and confirms the dialog
- **THEN** system removes `obsidian-mastery-progress`, `obsidian-mastery-notes`, `obsidian-mastery-milestones` from localStorage, then re-renders

#### Scenario: Cancel reset
- **WHEN** user clicks "초기화" but cancels the confirmation dialog
- **THEN** system takes no action and data remains unchanged

### Requirement: Calendar view displays completion state
The system SHALL render a 30-day calendar grid on the dashboard. Each day cell SHALL visually indicate whether it is completed (based on `progress` table data). Completed days SHALL be styled distinctly (e.g., checkmark, color change).

#### Scenario: Calendar reflects current progress
- **WHEN** authenticated user has completed days 1, 2, 3, 7, 14
- **THEN** calendar grid shows days 1, 2, 3, 7, 14 with completed styling and remaining days with default styling

### Requirement: Weekly overview displays per-week progress
The system SHALL render a weekly overview with collapsible week sections. Each week SHALL show a progress bar (completed/total days in that week) and individual day items with completion checkboxes.

#### Scenario: Week with partial completion
- **WHEN** authenticated user has completed 3 of 7 days in week 1
- **THEN** week 1 section shows progress bar at 43% and badge "3/7"

### Requirement: Achievements are computed from progress data
The system SHALL compute achievement/badge status from progress data (completed count, streak, note count). Achievements SHALL be rendered server-side based on data from `progress` and `notes` tables.

#### Scenario: Streak achievement unlocked
- **WHEN** authenticated user has completed 7 consecutive days (days 1-7)
- **THEN** "7일 연속" achievement badge is displayed as unlocked

#### Scenario: Note achievement unlocked
- **WHEN** authenticated user has saved notes for 10 or more days
- **THEN** "노트 마스터" achievement badge is displayed as unlocked

### Requirement: RLS enforces user data isolation
All three tables (`progress`, `notes`, `milestones`) SHALL have Row Level Security enabled. RLS policies SHALL restrict all operations (SELECT, INSERT, UPDATE, DELETE) to rows where `user_id` matches the authenticated user's `auth.uid()`. Unauthenticated requests SHALL return empty results.

#### Scenario: User cannot read other users' data
- **WHEN** user A queries the `progress` table
- **THEN** only rows where `user_id = auth.uid()` of user A are returned

#### Scenario: User cannot modify other users' data
- **WHEN** user A attempts to update a row in `notes` where `user_id` belongs to user B
- **THEN** the operation returns zero affected rows (silently blocked by RLS)

#### Scenario: Unauthenticated request returns nothing
- **WHEN** an unauthenticated request queries any table
- **THEN** the query returns an empty result set (RLS policies target `TO authenticated` only)

### Requirement: Data export includes server data
The system SHALL allow authenticated users to export their progress, notes, and milestones as a JSON file. The export SHALL fetch all user data from the three Supabase tables and download as a file.

#### Scenario: Export with data
- **WHEN** authenticated user clicks "내보내기"
- **THEN** system downloads a JSON file containing `{ version, exportedAt, progress: [...], notes: [...], milestones: [...] }`

#### Scenario: Export with no data
- **WHEN** authenticated user with no progress clicks "내보내기"
- **THEN** system downloads a JSON file with empty arrays for progress, notes, and milestones
