"use client";

import { toggleDay } from "@/app/actions/progress";
import { CURRICULUM, WEEK_OBJECTIVES } from "@/lib/data/curriculum";
import { DAY_META } from "@/lib/data/day-meta";
import { loadProgress, toggleDayLocal } from "@/lib/storage/local";
import type { User } from "@supabase/supabase-js";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";

type WeeklyOverviewProps = {
  user: User | null;
  initialProgress: Record<string, string>;
};

const TAG_STYLES: Record<string, string> = {
  plugin: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
  claude: "bg-violet-500/15 text-violet-300 border border-violet-500/30",
  core: "bg-sky-500/15 text-sky-300 border border-sky-500/30",
  system: "bg-orange-500/15 text-orange-300 border border-orange-500/30",
};

export function WeeklyOverview({ user, initialProgress }: WeeklyOverviewProps) {
  const [progress, setProgress] = useState<Record<string, string>>(initialProgress);
  const [openWeeks, setOpenWeeks] = useState<number[]>([1]);
  const [isPending, startTransition] = useTransition();

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

  const objectivesByWeek = useMemo(() => {
    return WEEK_OBJECTIVES.reduce(
      (acc, item) => {
        acc[item.week] = item.objectives;
        return acc;
      },
      {} as Record<number, string[]>
    );
  }, []);

  const emitProgressChange = (nextProgress: Record<string, string>) => {
    window.dispatchEvent(
      new CustomEvent<Record<string, string>>("obsidian-progress-change", {
        detail: nextProgress,
      })
    );
  };

  const handleToggleDay = (day: number) => {
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
      startTransition(() => {
        void toggleDay(day);
      });
      return;
    }

    const nextProgress = toggleDayLocal(day);
    setProgress(nextProgress);
    emitProgressChange(nextProgress);
  };

  const toggleWeek = (week: number) => {
    setOpenWeeks((prev) =>
      prev.includes(week) ? prev.filter((item) => item !== week) : [...prev, week]
    );
  };

  return (
    <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <h2 className="text-lg font-semibold text-zinc-100">주간 개요</h2>

      <div className="space-y-3">
        {CURRICULUM.map((week) => {
          const completed = week.days.filter((day) => Boolean(progress[String(day.day)])).length;
          const total = week.days.length;
          const percent = Math.round((completed / total) * 100);
          const isOpen = openWeeks.includes(week.week);

          return (
            <article key={week.week} className="rounded-xl border border-zinc-800 bg-zinc-950/40">
              <button
                type="button"
                onClick={() => toggleWeek(week.week)}
                className="flex w-full items-center justify-between gap-4 p-4 text-left"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-zinc-100">{week.title}</h3>
                    <span className="rounded-md border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-xs text-violet-200">
                      {completed}/{total} 완료
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full bg-gradient-to-r from-violet-600 to-violet-400 transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-zinc-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-zinc-400" />
                )}
              </button>

              {isOpen ? (
                <div className="space-y-4 border-t border-zinc-800 p-4">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Week Objectives
                    </p>
                    <ul className="space-y-1">
                      {(objectivesByWeek[week.week] ?? []).map((objective) => (
                        <li key={objective} className="text-sm text-zinc-300">
                          - {objective}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    {week.days.map((day) => {
                      const isCompleted = Boolean(progress[String(day.day)]);
                      const dayMeta = DAY_META[day.day];
                      const stars = "★".repeat(dayMeta.d) + "☆".repeat(5 - dayMeta.d);

                      return (
                        <div
                          key={day.day}
                          className="rounded-lg border border-zinc-800 bg-zinc-900/90 p-3"
                        >
                          <div className="mb-2 flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={isCompleted}
                              onChange={() => handleToggleDay(day.day)}
                              disabled={isPending}
                              className="mt-1 h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-violet-500"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="mb-1 flex flex-wrap items-center gap-2">
                                <span className="text-xs text-zinc-500">Day {day.day}</span>
                                <h4 className="text-sm font-medium text-zinc-100">{day.title}</h4>
                              </div>
                              <p className="text-sm text-zinc-400">{day.summary}</p>
                            </div>
                          </div>

                          <div className="mb-2 flex flex-wrap gap-2 text-xs">
                            <span className="rounded-md bg-zinc-800 px-2 py-1 text-zinc-400">
                              난이도 {stars}
                            </span>
                            <span className="rounded-md bg-zinc-800 px-2 py-1 text-zinc-400">
                              예상 {dayMeta.t}분
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {day.tags.map((tag) => (
                              <span
                                key={tag}
                                className={`rounded-md px-2 py-1 text-xs ${
                                  TAG_STYLES[tag] ??
                                  "border border-zinc-700 bg-zinc-800 text-zinc-300"
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
