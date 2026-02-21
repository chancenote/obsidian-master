'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveNote(day: number, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  if (content.trim()) {
    await supabase.from('notes').upsert({
      user_id: user.id,
      day,
      content,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,day' });
  } else {
    await supabase.from('notes').delete()
      .eq('user_id', user.id)
      .eq('day', day);
  }

  revalidatePath('/curriculum');
}

export async function deleteNote(day: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  await supabase.from('notes').delete()
    .eq('user_id', user.id)
    .eq('day', day);

  revalidatePath('/curriculum');
}
