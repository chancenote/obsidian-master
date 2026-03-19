'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleDay(day: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { data: existing } = await supabase
    .from('progress')
    .select('id')
    .eq('user_id', user.id)
    .eq('day', day)
    .single();

  if (existing) {
    await supabase.from('progress').delete().eq('id', existing.id);
  } else {
    await supabase.from('progress').insert({
      user_id: user.id,
      day,
      completed_at: new Date().toISOString(),
    });
  }

  revalidatePath('/');
  revalidatePath('/curriculum');
}

export async function resetProgress() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  await supabase.from('progress').delete().eq('user_id', user.id);
  await supabase.from('notes').delete().eq('user_id', user.id);
  await supabase.from('milestones').delete().eq('user_id', user.id);

  revalidatePath('/');
  revalidatePath('/curriculum');
}
