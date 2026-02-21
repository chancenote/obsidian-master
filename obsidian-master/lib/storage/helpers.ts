// Shared computation functions used by both localStorage and Supabase paths

export function getCompletedCount(progress: Record<string, string>): number {
  return Object.keys(progress).length;
}

export function getCompletionPercent(progress: Record<string, string>): number {
  return Math.round((getCompletedCount(progress) / 30) * 100);
}

export function getCurrentWeek(progress: Record<string, string>): number {
  const completedDays = Object.keys(progress).map(Number).sort((a, b) => a - b);
  if (completedDays.length === 0) return 1;
  const maxDay = completedDays[completedDays.length - 1];
  return Math.ceil(maxDay / 7);
}

export function getStreak(progress: Record<string, string>): number {
  const sortedDays = Object.keys(progress).map(Number).sort((a, b) => b - a);
  if (sortedDays.length === 0) return 0;

  let streak = 1;
  for (let i = 1; i < sortedDays.length; i++) {
    if (sortedDays[i] === sortedDays[i - 1] - 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function getNoteCount(notes: Record<string, string>): number {
  return Object.values(notes).filter(v => v.trim().length > 0).length;
}

// Convert Supabase rows → Record format used by both client/server
export function progressRowsToRecord(
  rows: Array<{ day: number; completed_at: string }>
): Record<string, string> {
  const record: Record<string, string> = {};
  for (const row of rows) {
    record[String(row.day)] = row.completed_at;
  }
  return record;
}

export function notesRowsToRecord(
  rows: Array<{ day: number; content: string }>
): Record<string, string> {
  const record: Record<string, string> = {};
  for (const row of rows) {
    record[String(row.day)] = row.content;
  }
  return record;
}

export function milestoneRowsToArray(
  rows: Array<{ milestone_percent: number }>
): number[] {
  return rows.map(r => r.milestone_percent);
}
