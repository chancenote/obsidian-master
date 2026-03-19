// localStorage adapter — mirrors original app.js key format
// Used by 'use client' components for unauthenticated users

export const KEYS = {
  PROGRESS: 'obsidian-mastery-progress',
  NOTES: 'obsidian-mastery-notes',
  MILESTONES: 'obsidian-mastery-milestones',
  ONBOARDED: 'obsidian-mastery-onboarded',
  MIGRATED: 'obsidian-mastery-migrated',
  BANNER_DISMISSED: 'obsidian-mastery-banner-dismissed',
} as const;

export function loadProgress(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const raw = localStorage.getItem(KEYS.PROGRESS);
  return raw ? JSON.parse(raw) : {};
}

export function saveProgress(progress: Record<string, string>): void {
  localStorage.setItem(KEYS.PROGRESS, JSON.stringify(progress));
}

export function toggleDayLocal(day: number): Record<string, string> {
  const progress = loadProgress();
  const key = String(day);
  if (progress[key]) {
    delete progress[key];
  } else {
    progress[key] = new Date().toISOString();
  }
  saveProgress(progress);
  return progress;
}

export function loadNotes(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const raw = localStorage.getItem(KEYS.NOTES);
  return raw ? JSON.parse(raw) : {};
}

export function saveNoteLocal(day: number, content: string): void {
  const notes = loadNotes();
  if (content.trim()) {
    notes[String(day)] = content;
  } else {
    delete notes[String(day)];
  }
  localStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
}

export function loadMilestones(): number[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(KEYS.MILESTONES);
  return raw ? JSON.parse(raw) : [];
}

export function saveMilestoneLocal(percent: number): void {
  const milestones = loadMilestones();
  if (!milestones.includes(percent)) {
    milestones.push(percent);
    localStorage.setItem(KEYS.MILESTONES, JSON.stringify(milestones));
  }
}
