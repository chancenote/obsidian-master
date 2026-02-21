"use client";

import type { User } from "@supabase/supabase-js";
import { BarChart3, CalendarDays, Flame, Target } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  getCompletedCount,
  getCompletionPercent,
  getCurrentWeek,
  getStreak,
} from "@/lib/storage/helpers";
import { loadProgress } from "@/lib/storage/local";

type StatsBarProps = {
  user: User | null;
  initialProgress: Record<string, string>;
};

export function StatsBar({ user, initialProgress }: StatsBarProps) {
  const [progress, setProgress] = useState<Record<string, string>>(initialProgress);

  useEffect(() => {
    if (!user) {
      setProgress(loadProgress());
    }

    const syncProgress = (event: Event) => {
      const customEvent = event as CustomEvent<Record<string, string>>;
      const nextProgress = customEvent.detail;
      if (nextProgress) {
        setProgress(nextProgress);
      }
    };

    window.addEventListener("obsidian-progress-change", syncProgress);
    return () => {
      window.removeEventListener("obsidian-progress-change", syncProgress);
    };
  }, [user]);

  const stats = useMemo(() => {
    const completed = getCompletedCount(progress);
    const percent = getCompletionPercent(progress);
    const week = getCurrentWeek(progress);
    const streak = getStreak(progress);

    return { completed, percent, week, streak };
  }, [progress]);

  return (
    <section className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Completed Days
            </span>
            <CalendarDays className="h-4 w-4 text-[#7ee787]" />
          </div>
          <p className="text-2xl font-bold text-[#7ee787]">{stats.completed}/30</p>
        </article>

        <article className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Progress
            </span>
            <BarChart3 className="h-4 w-4 text-[#a78bfa]" />
          </div>
          <p className="text-2xl font-bold text-[#a78bfa]">{stats.percent}%</p>
        </article>

        <article className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Current Week
            </span>
            <Target className="h-4 w-4 text-[#79c0ff]" />
          </div>
          <p className="text-2xl font-bold text-[#79c0ff]">Week {stats.week}</p>
        </article>

        <article className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Streak
            </span>
            <Flame className="h-4 w-4 text-[#ffa657]" />
          </div>
          <p className="text-2xl font-bold text-[#ffa657]">{stats.streak} days</p>
        </article>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-zinc-400">30일 로드맵 달성도</span>
          <span className="font-medium text-violet-300">{stats.percent}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-600 to-violet-400 transition-all duration-500"
            style={{ width: `${stats.percent}%` }}
          />
        </div>
      </div>
    </section>
  );
}
