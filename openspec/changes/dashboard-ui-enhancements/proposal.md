## Why

대시보드 UI의 정보 배치가 비효율적이고, 마일스톤 달성 시 축하 효과가 단조롭다. Achievements가 페이지 맨 하단에 있어 학습 동기 부여 효과가 약하고, 캘린더에 불필요한 요일 헤더가 공간을 차지하며, 축하 이벤트에 시각적 임팩트가 부족하다.

## What Changes

- **레이아웃 변경**: Achievements 섹션을 "30일 로드맵 달성도" 바로 아래(CalendarGrid 위)로 이동
- **캘린더 간소화**: 요일 헤더(월~일)와 빈 패딩 셀 제거, 30개 미션 타일만 유지 (grid-cols-7 유지)
- **축하 효과 강화**: CelebrationOverlay에 CSS 파티클 애니메이션(꽃가루, 불꽃) 추가, 마일스톤별 Achievement 연동 축하 메시지 화면 중앙 표시
- **Footer 문구 변경**: "Obsidian Master © 2026 프로그램은 NEXT COWORK이 함께합니다."로 변경

## Capabilities

### New Capabilities

(없음 — 기존 기능의 UI 개선)

### Modified Capabilities

- `progress-storage`: 마일스톤 달성 시 Achievement 연동 축하 메시지 요구사항 추가 (기존: 퍼센트 메시지만 → 변경: Achievement 이름/아이콘 포함 메시지)

## Impact

- **컴포넌트**: `app/page.tsx` (렌더 순서), `CalendarGrid.tsx` (요일 헤더 제거), `CelebrationOverlay.tsx` (파티클 효과 + Achievement 연동), `Footer.tsx` (문구), `globals.css` (파티클 keyframes)
- **의존성**: 없음 (CSS 애니메이션으로 구현, 추가 패키지 불필요)
- **DB**: 변경 없음 (마일스톤 퍼센트 체계 유지)
