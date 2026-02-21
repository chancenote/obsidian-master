'use server'

import { createClient } from "@/lib/supabase/server";

export async function checkMilestone(percent: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  if (![25, 50, 75, 100].includes(percent)) {
    return { error: 'Invalid milestone' };
  }

  const { data: existing } = await supabase
    .from('milestones')
    .select('id')
    .eq('user_id', user.id)
    .eq('milestone_percent', percent)
    .single();

  if (existing) return { alreadyShown: true };

  await supabase.from('milestones').insert({
    user_id: user.id,
    milestone_percent: percent,
  });

  return { newMilestone: true };
}
