"use client";

import { CURRICULUM, WEEK_OBJECTIVES } from "@/lib/data/curriculum";
import { DAY_META } from "@/lib/data/day-meta";
import { loadNotes, loadProgress, toggleDayLocal } from "@/lib/storage/local";
import type { User } from "@supabase/supabase-js";
import { ChevronDown, Copy, ExternalLink } from "lucide-react";
import { useEffect, useMemo, useState, useCallback } from "react";
import { DayCheckbox } from "./DayCheckbox";
import { NoteEditor } from "./NoteEditor";

type CurriculumViewProps = {
  user: User | null;
  initialProgress: Record<string, string>;
  initialNotes: Record<string, string>;
};

const TAG_STYLES: Record<string, string> = {
  plugin: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
  claude: "bg-violet-500/15 text-violet-300 border border-violet-500/30",
  core: "bg-sky-500/15 text-sky-300 border border-sky-500/30",
  system: "bg-orange-500/15 text-orange-300 border border-orange-500/30",
};

export function CurriculumView({
  user,
  initialProgress,
  initialNotes,
}: CurriculumViewProps) {
  const [progress, setProgress] = useState<Record<string, string>>(initialProgress);
  const [notes, setNotes] = useState<Record<string, string>>(initialNotes);
  const [openPractice, setOpenPractice] = useState<Set<number>>(new Set());
  const [promptModal, setPromptModal] = useState<{
    day: number;
    title: string;
    prompt: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) {
      setProgress(loadProgress());
      setNotes(loadNotes());
    }

    const syncProgress = (event: Event) => {
      const customEvent = event as CustomEvent<Record<string, string>>;
      if (customEvent.detail) {
        setProgress(customEvent.detail);
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

  const emitProgressChange = useCallback(
    (nextProgress: Record<string, string>) => {
      window.dispatchEvent(
        new CustomEvent<Record<string, string>>("obsidian-progress-change", {
          detail: nextProgress,
        })
      );
    },
    []
  );

  const handleToggle = useCallback(
    (day: number) => {
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
      } else {
        const nextProgress = toggleDayLocal(day);
        setProgress(nextProgress);
        emitProgressChange(nextProgress);
      }
    },
    [user, progress, emitProgressChange]
  );

  const togglePractice = (day: number) => {
    setOpenPractice((prev) => {
      const next = new Set(prev);
      if (next.has(day)) {
        next.delete(day);
      } else {
        next.add(day);
      }
      return next;
    });
  };

  const handleCopyPrompt = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const completedCount = Object.keys(progress).length;

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="mb-1 text-xl font-bold text-violet-400">
            30일 옵시디언 마스터 커리큘럼
          </h1>
          <p className="text-sm text-zinc-500">
            완료 {completedCount}/30일 &middot; 노트{" "}
            {Object.values(notes).filter((v) => v.trim()).length}개
            {user ? " (서버 동기화)" : " (로컬 저장)"}
          </p>
        </div>

        {/* Weeks */}
        {CURRICULUM.map((week) => {
          const weekCompleted = week.days.filter(
            (day) => Boolean(progress[String(day.day)])
          ).length;
          const weekTotal = week.days.length;

          return (
            <section
              key={week.week}
              className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900"
            >
              {/* Week header */}
              <div className="border-b border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-950 px-5 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-violet-300">
                    {week.title}
                  </h2>
                  <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 text-xs font-semibold text-violet-200">
                    {weekCompleted}/{weekTotal}
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-500">{week.description}</p>
              </div>

              {/* Week objectives */}
              {objectivesByWeek[week.week] && (
                <div className="border-b border-zinc-800/60 bg-violet-500/[0.02] px-5 py-3">
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-violet-400">
                    Week Objectives
                  </p>
                  <ul className="space-y-0.5 pl-4 text-sm text-zinc-400">
                    {objectivesByWeek[week.week].map((obj) => (
                      <li key={obj} className="list-disc leading-relaxed">
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Days */}
              <div>
                {week.days.map((day) => {
                  const isCompleted = Boolean(progress[String(day.day)]);
                  const dayMeta = DAY_META[day.day];
                  const stars =
                    "\u2605".repeat(dayMeta.d) +
                    "\u2606".repeat(5 - dayMeta.d);
                  const isPracticeOpen = openPractice.has(day.day);

                  return (
                    <article
                      key={day.day}
                      className="border-b border-zinc-800/60 px-5 py-4 transition-colors last:border-b-0 hover:bg-white/[0.01]"
                    >
                      {/* Day header row */}
                      <div className="mb-2 flex items-start gap-3">
                        <div className="mt-0.5 flex-shrink-0">
                          <DayCheckbox
                            day={day.day}
                            checked={isCompleted}
                            user={user}
                            onToggle={handleToggle}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-violet-400">
                              Day {day.day}
                            </span>
                            <h3 className="text-sm font-semibold text-zinc-100">
                              {day.title}
                            </h3>
                          </div>

                          {/* Meta badges */}
                          <div className="mb-2 flex flex-wrap gap-2 text-xs">
                            <span className="rounded border border-orange-500/20 bg-orange-500/10 px-1.5 py-0.5 text-orange-400">
                              {stars}
                            </span>
                            <span className="rounded border border-sky-500/20 bg-sky-500/10 px-1.5 py-0.5 text-sky-400">
                              {dayMeta.t}분
                            </span>
                          </div>

                          {/* Summary */}
                          <p className="text-sm leading-relaxed text-zinc-400">
                            {day.summary}
                          </p>

                          {/* Details */}
                          {day.details.length > 0 && (
                            <ul className="mt-2 space-y-1 pl-4 text-sm text-zinc-500">
                              {day.details.map((detail) => (
                                <li
                                  key={detail}
                                  className="list-disc leading-relaxed"
                                >
                                  {detail}
                                </li>
                              ))}
                            </ul>
                          )}

                          {/* Tags */}
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {day.tags.map((tag) => (
                              <span
                                key={tag}
                                className={`rounded-md px-2 py-0.5 text-xs ${
                                  TAG_STYLES[tag] ??
                                  "border border-zinc-700 bg-zinc-800 text-zinc-300"
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Practice box (collapsible) */}
                          {day.practice && (
                            <div className="mt-3 overflow-hidden rounded-lg border border-orange-500/25 bg-orange-500/[0.03]">
                              <button
                                type="button"
                                onClick={() => togglePractice(day.day)}
                                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-semibold text-orange-400 transition-colors hover:bg-orange-500/10"
                              >
                                <span>실습 과제</span>
                                <ChevronDown
                                  className={`h-4 w-4 transition-transform ${
                                    isPracticeOpen ? "rotate-180" : ""
                                  }`}
                                />
                              </button>
                              {isPracticeOpen && (
                                <div className="border-t border-orange-500/15 px-3 py-2.5 text-sm leading-relaxed text-zinc-300">
                                  {day.practice}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Claude prompt button */}
                          {day.prompt && (
                            <button
                              type="button"
                              onClick={() =>
                                setPromptModal({
                                  day: day.day,
                                  title: day.title,
                                  prompt: day.prompt,
                                })
                              }
                              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-violet-700 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-violet-900/30 transition-all hover:from-violet-500 hover:to-violet-600 hover:shadow-lg"
                            >
                              <span className="text-sm">🤖</span>
                              Claude에게 물어보기
                            </button>
                          )}

                          {/* Note editor */}
                          <div className="mt-3">
                            <NoteEditor
                              day={day.day}
                              initialContent={notes[String(day.day)] ?? ""}
                              user={user}
                            />
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Prompt modal */}
      {promptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-3">
              <h3 className="text-sm font-bold text-violet-300">
                Day {promptModal.day}: {promptModal.title}
              </h3>
              <button
                type="button"
                onClick={() => setPromptModal(null)}
                className="text-xl text-zinc-500 transition-colors hover:text-zinc-200"
              >
                &times;
              </button>
            </div>
            <div className="flex-1 overflow-y-auto whitespace-pre-wrap p-5 text-sm leading-relaxed text-zinc-300">
              {promptModal.prompt}
            </div>
            <div className="flex gap-2 border-t border-zinc-800 px-5 py-3">
              <button
                type="button"
                onClick={() => handleCopyPrompt(promptModal.prompt)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-700"
              >
                <Copy className="h-3.5 w-3.5" />
                {copied ? "복사됨!" : "복사"}
              </button>
              <a
                href={`https://claude.ai/new?q=${encodeURIComponent(promptModal.prompt)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-violet-700 px-4 py-2 text-sm font-medium text-white transition-all hover:from-violet-500 hover:to-violet-600"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Claude에서 열기
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
