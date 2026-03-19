"use client";

import { ACHIEVEMENTS_DATA } from "@/lib/data/achievements";
import {
  getCompletedCount,
  getNoteCount,
  getStreak,
} from "@/lib/storage/helpers";
import { loadNotes, loadProgress } from "@/lib/storage/local";
import type { User } from "@supabase/supabase-js";
import { useEffect, useMemo, useState } from "react";

type AchievementsProps = {
  user: User | null;
  initialProgress: Record<string, string>;
  initialNotes: Record<string, string>;
};

const SPECIAL_WEEK_RANGES: Record<number, [number, number]> = {
  1: [1, 7],
  2: [8, 14],
  3: [15, 21],
  4: [22, 30],
};

export function Achievements({
  user,
  initialProgress,
  initialNotes,
}: AchievementsProps) {
  const [progress, setProgress] = useState<Record<string, string>>(initialProgress);
  const [notes, setNotes] = useState<Record<string, string>>(initialNotes);

  useEffect(() => {
    if (!user) {
      setProgress(loadProgress());
      setNotes(loadNotes());
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

  const completedCount = useMemo(() => getCompletedCount(progress), [progress]);
  const streak = useMemo(() => getStreak(progress), [progress]);
  const noteCount = useMemo(() => getNoteCount(notes), [notes]);

  const isSpecialUnlocked = (week: number) => {
    const range = SPECIAL_WEEK_RANGES[week];
    if (!range) {
      return false;
    }

    const [start, end] = range;
    for (let day = start; day <= end; day++) {
      if (!progress[String(day)]) {
        return false;
      }
    }
    return true;
  };

  const unlockedCount = ACHIEVEMENTS_DATA.filter((achievement) => {
    switch (achievement.conditionType) {
      case "days":
        return completedCount >= achievement.conditionValue;
      case "streak":
        return streak >= achievement.conditionValue;
      case "notes":
        return noteCount >= achievement.conditionValue;
      case "special":
        return isSpecialUnlocked(achievement.conditionValue);
      default:
        return false;
    }
  }).length;

  return (
    <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-100">Achievements</h2>
        <p className="text-sm text-zinc-400">
          {unlockedCount}/{ACHIEVEMENTS_DATA.length} unlocked
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {ACHIEVEMENTS_DATA.map((achievement) => {
          const unlocked = (() => {
            switch (achievement.conditionType) {
              case "days":
                return completedCount >= achievement.conditionValue;
              case "streak":
                return streak >= achievement.conditionValue;
              case "notes":
                return noteCount >= achievement.conditionValue;
              case "special":
                return isSpecialUnlocked(achievement.conditionValue);
              default:
                return false;
            }
          })();

          return (
            <article
              key={achievement.id}
              className={[
                "rounded-xl border bg-zinc-950/70 p-3 transition-all",
                unlocked
                  ? "border-violet-500/60 opacity-100"
                  : "border-zinc-800 opacity-35 grayscale",
              ].join(" ")}
            >
              <div className="mb-2 text-2xl" aria-hidden="true">
                {achievement.icon}
              </div>
              <h3 className="mb-1 text-sm font-semibold text-zinc-100">{achievement.title}</h3>
              <p className="mb-2 text-xs text-zinc-400">{achievement.description}</p>
              <p className="text-[11px] text-zinc-500">{achievement.condition}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
