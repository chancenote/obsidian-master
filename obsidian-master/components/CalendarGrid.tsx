"use client";

import { checkMilestone } from "@/app/actions/milestones";
import { toggleDay } from "@/app/actions/progress";
import { CelebrationOverlay } from "@/components/CelebrationOverlay";
import { CURRICULUM } from "@/lib/data/curriculum";
import { DAY_META } from "@/lib/data/day-meta";
import { getCompletionPercent } from "@/lib/storage/helpers";
import {
  loadMilestones,
  loadProgress,
  saveMilestoneLocal,
  toggleDayLocal,
} from "@/lib/storage/local";
import type { User } from "@supabase/supabase-js";
import { useEffect, useMemo, useState, useTransition } from "react";

const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];
const MILESTONES = [25, 50, 75, 100];

const TITLE_BY_DAY = CURRICULUM.flatMap((week) => week.days).reduce(
  (acc, day) => {
    acc[day.day] = day.title;
    return acc;
  },
  {} as Record<number, string>
);

type CalendarGridProps = {
  user: User | null;
  initialProgress: Record<string, string>;
  initialMilestones: number[];
};

export function CalendarGrid({
  user,
  initialProgress,
  initialMilestones,
}: CalendarGridProps) {
  const [progress, setProgress] = useState<Record<string, string>>(initialProgress);
  const [milestones, setMilestones] = useState<number[]>(initialMilestones);
  const [overlayMessage, setOverlayMessage] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!user) {
      setProgress(loadProgress());
      setMilestones(loadMilestones());
    }
  }, [user]);

  const progressPercent = useMemo(() => getCompletionPercent(progress), [progress]);

  const emitProgressChange = (nextProgress: Record<string, string>) => {
    window.dispatchEvent(
      new CustomEvent<Record<string, string>>("obsidian-progress-change", {
        detail: nextProgress,
      })
    );
  };

  const maybeHandleMilestone = (
    nextProgress: Record<string, string>,
    knownMilestones: number[]
  ) => {
    const percent = getCompletionPercent(nextProgress);
    const reached = MILESTONES.find(
      (milestone) => percent >= milestone && !knownMilestones.includes(milestone)
    );

    if (!reached) {
      return;
    }

    const nextMilestones = [...knownMilestones, reached];
    setMilestones(nextMilestones);

    if (reached === 100) {
      setShowCertificate(true);
    } else {
      setOverlayMessage(`축하합니다! ${reached}% 마일스톤 달성!`);
      setShowOverlay(true);
    }

    if (user) {
      startTransition(() => {
        void checkMilestone(reached);
      });
    } else {
      saveMilestoneLocal(reached);
    }
  };

  const handleToggle = (day: number) => {
    if (isPending) {
      return;
    }

    if (user) {
      const key = String(day);
      const nextProgress = { ...progress };
      if (nextProgress[key]) {
        delete nextProgress[key];
      } else {
        nextProgress[key] = new Date().toISOString();
      }

      setProgress(nextProgress);
      emitProgressChange(nextProgress);
      maybeHandleMilestone(nextProgress, milestones);

      startTransition(() => {
        void toggleDay(day);
      });
      return;
    }

    const nextProgress = toggleDayLocal(day);
    setProgress(nextProgress);
    emitProgressChange(nextProgress);
    maybeHandleMilestone(nextProgress, milestones);
  };

  return (
    <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-100">30일 캘린더</h2>
        <p className="text-sm text-zinc-400">완료율 {progressPercent}%</p>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {WEEKDAYS.map((weekday) => (
          <div
            key={weekday}
            className="rounded-md border border-zinc-800 bg-zinc-950/70 py-2 text-center text-xs font-semibold text-zinc-500"
          >
            {weekday}
          </div>
        ))}

        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="h-20 rounded-lg border border-dashed border-zinc-800/80"
          />
        ))}

        {Array.from({ length: 30 }).map((_, index) => {
          const day = index + 1;
          const key = String(day);
          const isCompleted = Boolean(progress[key]);
          const dayMeta = DAY_META[day];
          const dayTitle = TITLE_BY_DAY[day];

          return (
            <button
              key={day}
              type="button"
              onClick={() => handleToggle(day)}
              disabled={isPending}
              title={`Day ${day}: ${dayTitle}`}
              className={[
                "h-20 rounded-lg border p-2 text-left transition",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60",
                isCompleted
                  ? "border-violet-500/50 bg-gradient-to-br from-violet-600 to-violet-800 text-zinc-100"
                  : "border-zinc-800 bg-zinc-950/80 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900",
                isPending ? "cursor-wait opacity-80" : "cursor-pointer",
              ].join(" ")}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold">{day}</span>
                {isCompleted ? (
                  <span className="text-[11px] font-semibold text-emerald-300">완료</span>
                ) : (
                  <span className="text-[11px] text-zinc-500">미완료</span>
                )}
              </div>
              <p className="truncate text-xs font-medium">{dayMeta.k}</p>
            </button>
          );
        })}
      </div>

      <CelebrationOverlay
        show={showOverlay}
        message={overlayMessage}
        onClose={() => setShowOverlay(false)}
      />
      <CelebrationOverlay
        show={showCertificate}
        message="30일 옵시디언 마스터 과정을 모두 완료하셨습니다!"
        isCertificate
        onClose={() => setShowCertificate(false)}
      />
    </section>
  );
}
