## 1. 레이아웃 순서 변경

- [x] 1.1 `app/page.tsx`에서 Achievements 렌더 순서를 StatsBar 직후, CalendarGrid 이전으로 이동

## 2. 캘린더 간소화

- [x] 2.1 `CalendarGrid.tsx`에서 WEEKDAYS 헤더 행 렌더링 제거
- [x] 2.2 `CalendarGrid.tsx`에서 빈 패딩 셀(Array.from({ length: 2 })) 제거

## 3. 축하 효과 강화

- [x] 3.1 `globals.css`에 confetti-fall, sparkle-burst @keyframes 애니메이션 추가
- [x] 3.2 `CelebrationOverlay.tsx`에 파티클 컨테이너 추가: 20개 이내의 confetti 요소 + sparkle 요소 렌더링
- [x] 3.3 `CelebrationOverlay.tsx`에 `icon` prop 추가, 기존 이모지 3개 대신 단일 대형 아이콘 표시
- [x] 3.4 `CalendarGrid.tsx`의 마일스톤 메시지를 Achievement 연동으로 변경: 25% → "🎉 25% 달성! 좋은 페이스에요!", 50% → "⚡ 절반 달성! 옵시디언이 손에 익기 시작했죠?", 75% → "🔥 75% 달성! 마스터가 눈앞이에요!"

## 4. Footer 문구 변경

- [x] 4.1 `Footer.tsx`의 텍스트를 "Obsidian Master © {year} 프로그램은 NEXT COWORK이 함께합니다."로 변경

## 5. 검증

- [x] 5.1 `npm run build` 통과 확인
- [x] 5.2 Vercel 재배포 및 라이브 사이트 확인
