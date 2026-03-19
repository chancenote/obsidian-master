import { CurriculumView } from "@/components/curriculum/CurriculumView";
import { progressRowsToRecord, notesRowsToRecord } from "@/lib/storage/helpers";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

export default function CurriculumPage() {
  return (
    <Suspense>
      <CurriculumContent />
    </Suspense>
  );
}

async function CurriculumContent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let progress: Record<string, string> = {};
  let notes: Record<string, string> = {};

  if (user) {
    const [progressRes, notesRes] = await Promise.all([
      supabase.from("progress").select("day, completed_at").eq("user_id", user.id),
      supabase.from("notes").select("day, content").eq("user_id", user.id),
    ]);

    progress = progressRowsToRecord(progressRes.data ?? []);
    notes = notesRowsToRecord(notesRes.data ?? []);
  }

  return <CurriculumView user={user} initialProgress={progress} initialNotes={notes} />;
}
