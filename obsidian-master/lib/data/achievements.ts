import type { Achievement } from './types';

export const ACHIEVEMENTS_DATA: Achievement[] = [
  {
    "id": "first_step",
    "title": "첫 발걸음",
    "description": "Day 1 완료",
    "icon": "🚀",
    "condition": "Day 1 완료",
    "conditionType": "days",
    "conditionValue": 1
  },
  {
    "id": "streak_3",
    "title": "3일 연속",
    "description": "3일 연속 학습",
    "icon": "🔥",
    "condition": "연속 학습일 3일 이상",
    "conditionType": "streak",
    "conditionValue": 3
  },
  {
    "id": "week1",
    "title": "기초 마스터",
    "description": "1주차 완료",
    "icon": "⭐",
    "condition": "1주차(1~7일) 모두 완료",
    "conditionType": "special",
    "conditionValue": 1
  },
  {
    "id": "halfway",
    "title": "절반 달성",
    "description": "15일 완료",
    "icon": "⚡",
    "condition": "완료한 학습일 15일 이상",
    "conditionType": "days",
    "conditionValue": 15
  },
  {
    "id": "week2",
    "title": "플러그인 탐험가",
    "description": "2주차 완료",
    "icon": "📚",
    "condition": "2주차(8~14일) 모두 완료",
    "conditionType": "special",
    "conditionValue": 2
  },
  {
    "id": "streak_7",
    "title": "7일 연속",
    "description": "7일 연속 학습",
    "icon": "💪",
    "condition": "연속 학습일 7일 이상",
    "conditionType": "streak",
    "conditionValue": 7
  },
  {
    "id": "week3",
    "title": "지식 관리자",
    "description": "3주차 완료",
    "icon": "🧠",
    "condition": "3주차(15~21일) 모두 완료",
    "conditionType": "special",
    "conditionValue": 3
  },
  {
    "id": "notes_5",
    "title": "성실한 기록자",
    "description": "학습 노트 5개 작성",
    "icon": "📝",
    "condition": "작성한 학습 노트 5개 이상",
    "conditionType": "notes",
    "conditionValue": 5
  },
  {
    "id": "week4",
    "title": "자동화 전문가",
    "description": "4주차 완료",
    "icon": "🤖",
    "condition": "4주차(22~30일) 모두 완료",
    "conditionType": "special",
    "conditionValue": 4
  },
  {
    "id": "master",
    "title": "옵시디언 마스터",
    "description": "30일 전체 완료!",
    "icon": "🏆",
    "condition": "완료한 학습일 30일 이상",
    "conditionType": "days",
    "conditionValue": 30
  }
];
