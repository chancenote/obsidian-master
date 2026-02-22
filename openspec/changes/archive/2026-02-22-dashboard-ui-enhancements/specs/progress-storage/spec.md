## MODIFIED Requirements

### Requirement: Milestones are tracked and celebrated
The system SHALL track milestone achievements (25%, 50%, 75%, 100% completion). When a user's progress reaches a milestone percentage for the first time, the system SHALL insert a row into the `milestones` table and trigger a celebration overlay with CSS particle animation (confetti/sparkle effects) and an Achievement-linked message displayed centered on screen. The celebration overlay SHALL include falling confetti particles and radial sparkle effects. Milestones already shown (existing row in DB) SHALL NOT be shown again.

The celebration message SHALL include the Achievement icon and a motivational message matching the milestone:
- 25%: "🎉 25% 달성! 좋은 페이스에요!"
- 50%: "⚡ 절반 달성! 옵시디언이 손에 익기 시작했죠?"
- 75%: "🔥 75% 달성! 마스터가 눈앞이에요!"
- 100%: Certificate modal (existing behavior preserved)

#### Scenario: First milestone reached with particle effects
- **WHEN** authenticated user completes their 8th day (>25%) and no 25% milestone exists in DB
- **THEN** system inserts `(user_id, milestone_percent=25, shown_at=now())` and displays celebration overlay with confetti particle animation, sparkle effects, and message "🎉 25% 달성! 좋은 페이스에요!" centered on screen

#### Scenario: 50% milestone with Achievement icon
- **WHEN** user reaches 50% completion (15+ days) for the first time
- **THEN** system displays celebration overlay with particle effects and message "⚡ 절반 달성! 옵시디언이 손에 익기 시작했죠?"

#### Scenario: Milestone already shown
- **WHEN** authenticated user reloads after 25% milestone was already recorded
- **THEN** system does NOT display the celebration overlay for 25%

#### Scenario: 100% completion certificate
- **WHEN** authenticated user completes all 30 days and 100% milestone is recorded
- **THEN** system displays celebration overlay followed by a completion certificate modal

#### Scenario: Particle animation performance
- **WHEN** celebration overlay is displayed
- **THEN** particle count SHALL NOT exceed 20 elements and all particles SHALL use CSS transforms with `will-change: transform` for GPU acceleration

## ADDED Requirements

### Requirement: Dashboard layout places Achievements after roadmap progress
The dashboard SHALL render components in this order: LoginBanner → StatsBar (with roadmap progress bar) → Achievements → CalendarGrid → WeeklyOverview. The Achievements section SHALL appear directly below the "30일 로드맵 달성도" progress bar.

#### Scenario: Achievements visible below progress bar
- **WHEN** user views the dashboard
- **THEN** Achievements section appears directly after the StatsBar (which contains the roadmap progress bar), before the CalendarGrid

### Requirement: Calendar grid displays mission tiles without weekday headers
The 30-day calendar grid SHALL render only the 30 mission tiles in a 7-column grid layout. The calendar SHALL NOT display weekday header row (월~일) or empty padding cells. The grid-cols-7 layout SHALL be preserved.

#### Scenario: Calendar without weekday headers
- **WHEN** user views the 30-day calendar
- **THEN** calendar displays 30 mission tiles in grid-cols-7 without any weekday header row or empty cells before Day 1

### Requirement: Footer displays partnership text
The footer SHALL display the text "Obsidian Master © {year} 프로그램은 NEXT COWORK이 함께합니다." where {year} is the current year.

#### Scenario: Footer text
- **WHEN** user views the dashboard footer
- **THEN** footer displays "Obsidian Master © 2026 프로그램은 NEXT COWORK이 함께합니다."
