'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface LocalData {
  progress: Record<string, string>;  // { "1": "2024-01-01T...", "5": "2024-01-05T..." }
  notes: Record<string, string>;     // { "1": "my note", "5": "another" }
  milestones: number[];              // [25, 50]
}

export async function checkServerData(): Promise<{
  error?: string;
  hasData: boolean;
}> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated', hasData: false };

  const { count } = await supabase
    .from('progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  return { hasData: (count ?? 0) > 0 };
}

export async function migrateFromLocal(
  localData: LocalData,
  overwrite: boolean = false
): Promise<{
  error?: string;
  success?: boolean;
  migrated?: { progress: number; notes: number; milestones: number };
}> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  // If overwrite, delete existing server data first
  if (overwrite) {
    await supabase.from('progress').delete().eq('user_id', user.id);
    await supabase.from('notes').delete().eq('user_id', user.id);
    await supabase.from('milestones').delete().eq('user_id', user.id);
  }

  // Migrate progress
  const progressRows = Object.entries(localData.progress)
    .filter(([day]) => {
      const d = parseInt(day, 10);
      return d >= 1 && d <= 30;
    })
    .map(([day, completedAt]) => ({
      user_id: user.id,
      day: parseInt(day, 10),
      completed_at: completedAt,
    }));

  if (progressRows.length > 0) {
    const { error: pErr } = await supabase
      .from('progress')
      .upsert(progressRows, { onConflict: 'user_id,day' });
    if (pErr) return { error: `진행도 마이그레이션 실패: ${pErr.message}` };
  }

  // Migrate notes
  const noteRows = Object.entries(localData.notes)
    .filter(([day, content]) => {
      const d = parseInt(day, 10);
      return d >= 1 && d <= 30 && content.trim().length > 0;
    })
    .map(([day, content]) => ({
      user_id: user.id,
      day: parseInt(day, 10),
      content,
      updated_at: new Date().toISOString(),
    }));

  if (noteRows.length > 0) {
    const { error: nErr } = await supabase
      .from('notes')
      .upsert(noteRows, { onConflict: 'user_id,day' });
    if (nErr) return { error: `노트 마이그레이션 실패: ${nErr.message}` };
  }

  // Migrate milestones
  const milestoneRows = localData.milestones
    .filter(p => [25, 50, 75, 100].includes(p))
    .map(percent => ({
      user_id: user.id,
      milestone_percent: percent,
    }));

  if (milestoneRows.length > 0) {
    const { error: mErr } = await supabase
      .from('milestones')
      .upsert(milestoneRows, { onConflict: 'user_id,milestone_percent' });
    if (mErr) return { error: `마일스톤 마이그레이션 실패: ${mErr.message}` };
  }

  revalidatePath('/');
  revalidatePath('/curriculum');

  return {
    success: true,
    migrated: {
      progress: progressRows.length,
      notes: noteRows.length,
      milestones: milestoneRows.length,
    },
  };
}
