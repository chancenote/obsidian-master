'use server'

import { createClient } from "@/lib/supabase/server";

export interface ExportData {
  version: 2;
  exportedAt: string;
  progress: Array<{ day: number; completed_at: string }>;
  notes: Array<{ day: number; content: string }>;
  milestones: number[];
}

export async function exportUserData(): Promise<{
  error?: string;
  data?: ExportData;
}> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const [progressRes, notesRes, milestonesRes] = await Promise.all([
    supabase
      .from('progress')
      .select('day, completed_at')
      .eq('user_id', user.id)
      .order('day'),
    supabase
      .from('notes')
      .select('day, content')
      .eq('user_id', user.id)
      .order('day'),
    supabase
      .from('milestones')
      .select('milestone_percent')
      .eq('user_id', user.id)
      .order('milestone_percent'),
  ]);

  return {
    data: {
      version: 2,
      exportedAt: new Date().toISOString(),
      progress: progressRes.data ?? [],
      notes: notesRes.data ?? [],
      milestones: (milestonesRes.data ?? []).map(m => m.milestone_percent),
    },
  };
}
