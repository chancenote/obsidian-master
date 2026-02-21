## ADDED Requirements

### Requirement: User can sign up with email and password
The system SHALL allow users to create an account using email and password via Supabase Auth. The sign-up form SHALL be a Server Action (`signUp`) that calls `supabase.auth.signUp()` on the server. On success, the system SHALL redirect to the dashboard. On failure, the system SHALL display the error message.

#### Scenario: Successful sign-up
- **WHEN** user submits sign-up form with valid email and password (6+ characters)
- **THEN** system creates a Supabase Auth account, sets session cookies, and redirects to `/`

#### Scenario: Sign-up with existing email
- **WHEN** user submits sign-up form with an email that already exists
- **THEN** system displays an error message without creating a duplicate account

#### Scenario: Sign-up with invalid password
- **WHEN** user submits sign-up form with a password shorter than 6 characters
- **THEN** system displays a validation error and does not submit to Supabase

### Requirement: User can sign in with email and password
The system SHALL allow existing users to sign in via a Server Action (`signIn`) that calls `supabase.auth.signInWithPassword()`. On success, the system SHALL set session cookies and redirect to the dashboard. On failure, the system SHALL display the error message.

#### Scenario: Successful sign-in
- **WHEN** user submits login form with correct email and password
- **THEN** system authenticates, sets session cookies via `@supabase/ssr`, and redirects to `/`

#### Scenario: Sign-in with wrong credentials
- **WHEN** user submits login form with incorrect email or password
- **THEN** system displays "Invalid login credentials" error and remains on `/login`

### Requirement: User can sign out
The system SHALL allow authenticated users to sign out via a Server Action that calls `supabase.auth.signOut()`. On sign-out, the system SHALL clear session cookies and redirect to `/login`.

#### Scenario: Successful sign-out
- **WHEN** authenticated user clicks the sign-out button
- **THEN** system clears session cookies and redirects to `/login`

### Requirement: Session persistence via cookies
The system SHALL persist auth sessions in HTTP cookies using `@supabase/ssr`. The session MUST survive page reloads and new tab openings. The session SHALL NOT use localStorage for token storage.

#### Scenario: Session restored on page reload
- **WHEN** authenticated user reloads the page
- **THEN** system reads session from cookies and renders authenticated state without requiring re-login

#### Scenario: Session available in new tab
- **WHEN** authenticated user opens the app in a new browser tab
- **THEN** system reads session from cookies and renders authenticated state

### Requirement: Middleware refreshes JWT on every request
The Next.js middleware (`proxy.ts`) SHALL run on every non-static request and call `getClaims()` to validate and refresh the JWT token. The middleware SHALL update session cookies on the response. The middleware MUST NOT run on static assets (`_next/static`, `_next/image`, images, favicon).

#### Scenario: Token refresh on navigation
- **WHEN** authenticated user navigates to a new page
- **THEN** middleware validates JWT via `getClaims()`, refreshes cookie if needed, and passes request through

#### Scenario: Static assets bypass middleware
- **WHEN** browser requests `_next/static/chunk.js` or `favicon.ico`
- **THEN** middleware does NOT execute (matched by exclusion pattern)

#### Scenario: Expired token triggers refresh
- **WHEN** request arrives with an expired JWT
- **THEN** middleware refreshes the token using the refresh token in cookies and sets updated cookies on the response

### Requirement: All learning pages are public (no auth redirect)
All 학습 페이지(`/`, `/curriculum`, `/youtube`)는 퍼블릭 경로로 열어두어야 한다. 미들웨어는 이 경로들에서 미인증 사용자를 리다이렉트하지 않는다. 미인증 사용자는 기존처럼 localStorage를 이용하여 학습을 계속할 수 있다. 미들웨어는 세션 갱신만 수행하고, 인증 여부에 관계없이 요청을 통과시킨다.

#### Scenario: Unauthenticated user accesses dashboard
- **WHEN** unauthenticated user navigates to `/`
- **THEN** middleware passes request through (no redirect). Page renders with localStorage-based data.

#### Scenario: Unauthenticated user accesses curriculum
- **WHEN** unauthenticated user navigates to `/curriculum`
- **THEN** page renders normally with localStorage-based notes and progress

#### Scenario: Authenticated user accesses dashboard
- **WHEN** authenticated user navigates to `/`
- **THEN** middleware refreshes session. Page renders with Supabase DB-based data.

#### Scenario: Auth callback route is public
- **WHEN** request arrives at `/auth/callback` (email confirmation redirect)
- **THEN** middleware allows the request through regardless of auth state

### Requirement: Login prompt banner for unauthenticated users
미인증 사용자가 학습 페이지를 이용할 때, 화면 상단에 "로그인하면 진도를 서버에 동기화할 수 있어요" 배너를 표시한다. 배너에는 로그인 페이지로의 링크가 포함된다. 배너는 닫기(dismiss) 가능하며, 닫은 상태는 localStorage에 저장한다.

#### Scenario: Banner displayed for unauthenticated user
- **WHEN** unauthenticated user navigates to any learning page (`/`, `/curriculum`)
- **THEN** page top displays a banner: "로그인하면 진도를 서버에 동기화할 수 있어요" with a link to `/login`

#### Scenario: Banner dismissed
- **WHEN** unauthenticated user clicks the dismiss button on the banner
- **THEN** banner hides and dismissal is saved to localStorage so it does not reappear

#### Scenario: Banner not shown for authenticated users
- **WHEN** authenticated user navigates to any learning page
- **THEN** login prompt banner is NOT displayed

### Requirement: Login page provides sign-up and sign-in tabs
The `/login` page SHALL display a form with two modes: sign-in (default) and sign-up. Users SHALL be able to toggle between modes. Each mode SHALL submit to its respective Server Action.

#### Scenario: Default view is sign-in
- **WHEN** user navigates to `/login`
- **THEN** sign-in form is displayed by default with email and password fields

#### Scenario: Toggle to sign-up
- **WHEN** user clicks "회원가입" tab/link on the login page
- **THEN** form switches to sign-up mode with email and password fields

### Requirement: Auth state displayed in header
The global layout SHALL display the current auth state in the header. When authenticated, the header SHALL show the user's email and a sign-out button. When unauthenticated (on public pages), the header SHALL show a sign-in link.

#### Scenario: Authenticated header
- **WHEN** authenticated user views any page
- **THEN** header displays user email and "로그아웃" button

#### Scenario: Unauthenticated header on public page
- **WHEN** unauthenticated user views any learning page (`/`, `/curriculum`, `/youtube`)
- **THEN** header displays "로그인" link to `/login`
