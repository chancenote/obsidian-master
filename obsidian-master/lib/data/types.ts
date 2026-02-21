export interface Day {
  day: number;
  title: string;
  summary: string;
  tags: string[];
  details: string[];
  practice: string;
  prompt: string;
}

export interface Week {
  week: number;
  title: string;
  description: string;
  days: Day[];
}

export interface DayMeta {
  d: number;
  t: number;
  k: string;
}

export type AchievementConditionType = 'days' | 'streak' | 'notes' | 'special';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: string;
  conditionType: AchievementConditionType;
  conditionValue: number;
}

export interface WeekObjective {
  week: number;
  objectives: string[];
}

export interface YouTubeItem {
  title: string;
  channel: string;
  desc: string;
  search: string;
  url?: string;
}

export interface YouTubeSection {
  section: string;
  items: YouTubeItem[];
}

export interface YouTubeData {
  korean: YouTubeSection[];
  international: YouTubeSection[];
}
