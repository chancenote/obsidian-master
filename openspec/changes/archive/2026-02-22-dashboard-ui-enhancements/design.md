## Context

Obsidian Master 대시보드는 StatsBar → CalendarGrid → WeeklyOverview → Achievements → Footer 순으로 렌더된다. 마일스톤(25/50/75/100%) 달성 시 CelebrationOverlay가 바운싱 이모지 3개와 퍼센트 메시지만 표시한다. 캘린더에는 요일 헤더(월~일)와 빈 패딩 셀 2개가 포함되어 있다.

## Goals / Non-Goals

**Goals:**
- Achievements를 로드맵 달성도 직후에 배치하여 학습 동기 부여 강화
- 캘린더에서 요일 헤더와 빈 셀을 제거하여 미션 타일에 집중
- 마일스톤 달성 시 CSS 파티클 애니메이션(꽃가루/불꽃)과 Achievement 연동 메시지로 축하 효과 강화
- Footer 문구를 "Obsidian Master © 2026 프로그램은 NEXT COWORK이 함께합니다."로 변경

**Non-Goals:**
- 마일스톤 퍼센트 체계(25/50/75/100) 변경
- DB 스키마 변경
- 외부 애니메이션 라이브러리(canvas-confetti 등) 도입
- 캘린더 열 수 변경 (grid-cols-7 유지)

## Decisions

### 1. 레이아웃 순서: Achievements를 StatsBar 직후로 이동

**변경**: `app/page.tsx`의 렌더 순서를 수정

```
Before: StatsBar → CalendarGrid → WeeklyOverview → Achievements
After:  StatsBar → Achievements → CalendarGrid → WeeklyOverview
```

**이유**: 로드맵 달성도 프로그레스 바 바로 아래에 업적 뱃지가 오면 진행 상황과 보상이 시각적으로 연결된다.

### 2. 캘린더 간소화: 요일 헤더/빈 셀 제거

**변경**: `CalendarGrid.tsx`에서 `WEEKDAYS.map(...)` 행과 빈 셀(`Array.from({ length: 2 })`) 제거

**유지**: `grid-cols-7`, 30개 미션 타일 레이아웃, 타일 디자인

**결과**: 30개 타일이 7열로 배치 → 5행(7+7+7+7+2). 마지막 행에 빈 공간 5칸은 자연스럽게 빈 채로 남음.

### 3. 축하 효과: CSS 파티클 + Achievement 연동 메시지

**구현 방식**: 순수 CSS `@keyframes` + 의사 요소로 파티클 효과 구현. 외부 라이브러리 없음.

**파티클 종류**:
- **꽃가루(confetti)**: 다양한 색상의 작은 사각형/원이 위에서 아래로 떨어지는 애니메이션
- **불꽃(sparkle)**: 반짝이는 점들이 중앙에서 방사형으로 퍼지는 애니메이션

**Achievement 연동 메시지**: 마일스톤 달성 시 해당 퍼센트에 해당하는 Achievement를 매칭하여 아이콘+제목 포함 메시지 표시.

마일스톤 → Achievement 매핑:
| Milestone | 완료일 | 매칭 Achievement | 메시지 |
|-----------|--------|-----------------|--------|
| 25% | 8일+ | `halfway` 방향 → 없음. 자체 메시지 | "🎉 25% 달성! 좋은 페이스에요!" |
| 50% | 15일+ | `halfway` (15일 완료) | "⚡ 절반 달성! 옵시디언이 손에 익기 시작했죠?" |
| 75% | 23일+ | 자체 메시지 | "🔥 75% 달성! 마스터가 눈앞이에요!" |
| 100% | 30일 | `master` (30일 완료) | 인증서 모달 (기존 유지) |

**CelebrationOverlay 확장**: `message` 외에 `icon` prop 추가. 파티클 컨테이너를 오버레이 내부에 렌더링.

### 4. CSS 파티클 애니메이션 설계

`globals.css`에 `@keyframes` 정의:

```css
@keyframes confetti-fall {
  0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}

@keyframes sparkle-burst {
  0% { transform: scale(0) rotate(0deg); opacity: 1; }
  50% { opacity: 1; }
  100% { transform: scale(1) rotate(180deg); opacity: 0; }
}
```

파티클 요소는 CelebrationOverlay 내부에서 `div` 배열로 렌더링 (12~20개). 각 파티클에 랜덤 위치, 색상, 딜레이를 인라인 스타일로 적용.

### 5. Footer 문구 변경

단순 텍스트 교체. 기존 `Obsidian Master © {year}` → `Obsidian Master © {year} 프로그램은 NEXT COWORK이 함께합니다.`

## Risks / Trade-offs

**[CSS 파티클 성능]** → 파티클 수를 20개 이내로 제한하고 `will-change: transform` 적용. 애니메이션 종료 후 DOM에서 제거 (오버레이 닫기 시).

**[Achievement 매핑 하드코딩]** → 마일스톤 퍼센트와 Achievement 매핑을 CalendarGrid에 상수로 정의. Achievement 데이터가 변경되면 매핑도 수동 업데이트 필요. 현재 규모(10개 Achievement)에서는 충분.
