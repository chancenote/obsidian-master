"use client";

import type { User } from "@supabase/supabase-js";
import { Download, RotateCcw } from "lucide-react";
import { useState, useTransition } from "react";
import { exportUserData } from "@/app/actions/export";
import { resetProgress } from "@/app/actions/progress";
import {
  KEYS,
  loadProgress,
  loadNotes,
  loadMilestones,
} from "@/lib/storage/local";

type FooterProps = {
  user: User | null;
};

export function Footer({ user }: FooterProps) {
  const [isPending, startTransition] = useTransition();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleExport = () => {
    if (user) {
      // Authenticated: fetch from Supabase via Server Action
      startTransition(async () => {
        const result = await exportUserData();
        if (result.error || !result.data) return;
        downloadJson(result.data);
      });
    } else {
      // Unauthenticated: read from localStorage
      const data = {
        version: 2 as const,
        exportedAt: new Date().toISOString(),
        progress: Object.entries(loadProgress()).map(([day, completed_at]) => ({
          day: parseInt(day, 10),
          completed_at,
        })),
        notes: Object.entries(loadNotes())
          .filter(([, content]) => content.trim())
          .map(([day, content]) => ({
            day: parseInt(day, 10),
            content,
          })),
        milestones: loadMilestones(),
      };
      downloadJson(data);
    }
  };

  const downloadJson = (data: object) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `obsidian-master-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (!showResetConfirm) {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 3000);
      return;
    }

    if (user) {
      startTransition(async () => {
        await resetProgress();
        window.location.reload();
      });
    } else {
      localStorage.removeItem(KEYS.PROGRESS);
      localStorage.removeItem(KEYS.NOTES);
      localStorage.removeItem(KEYS.MILESTONES);
      window.location.reload();
    }
  };

  return (
    <footer className="mx-auto mt-8 flex max-w-5xl items-center justify-between border-t border-zinc-800 px-4 py-4 text-xs text-zinc-500">
      <span>Obsidian Master &copy; {new Date().getFullYear()}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleExport}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-zinc-400 transition-colors hover:border-violet-600 hover:text-violet-300"
        >
          <Download className="h-3.5 w-3.5" />
          내보내기
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={isPending}
          className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 transition-colors ${
            showResetConfirm
              ? "border-red-600 bg-red-900/30 text-red-400"
              : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-red-600 hover:text-red-400"
          }`}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {showResetConfirm ? "정말 초기화?" : "초기화"}
        </button>
      </div>
    </footer>
  );
}
