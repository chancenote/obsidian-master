import { LoginBanner } from "@/components/LoginBanner";
import { Achievements } from "@/components/Achievements";
import { CalendarGrid } from "@/components/CalendarGrid";
import { Footer } from "@/components/Footer";
import { StatsBar } from "@/components/StatsBar";
import { WeeklyOverview } from "@/components/WeeklyOverview";
import {
  milestoneRowsToArray,
  notesRowsToRecord,
  progressRowsToRecord,
} from "@/lib/storage/helpers";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let progress: Record<string, string> = {};
  let notes: Record<string, string> = {};
  let milestones: number[] = [];

  if (user) {
    const [progressRes, notesRes, milestonesRes] = await Promise.all([
      supabase
        .from("progress")
        .select("day, completed_at")
        .eq("user_id", user.id),
      supabase.from("notes").select("day, content").eq("user_id", user.id),
      supabase
        .from("milestones")
        .select("milestone_percent")
        .eq("user_id", user.id),
    ]);

    progress = progressRowsToRecord(progressRes.data ?? []);
    notes = notesRowsToRecord(notesRes.data ?? []);
    milestones = milestoneRowsToArray(milestonesRes.data ?? []);
  }

  return (
    <>
      <section className="space-y-8">
        <LoginBanner user={user} />
        <StatsBar user={user} initialProgress={progress} />
        <Achievements user={user} initialProgress={progress} initialNotes={notes} />
        <CalendarGrid
          user={user}
          initialProgress={progress}
          initialMilestones={milestones}
        />
        <WeeklyOverview user={user} initialProgress={progress} />
      </section>
      <Footer user={user} />
    </>
  );
}
