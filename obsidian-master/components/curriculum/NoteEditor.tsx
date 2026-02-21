"use client";

import { saveNote } from "@/app/actions/notes";
import { saveNoteLocal } from "@/lib/storage/local";
import type { User } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";

type NoteEditorProps = {
  day: number;
  initialContent: string;
  user: User | null;
};

export function NoteEditor({ day, initialContent, user }: NoteEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [lastSavedContent, setLastSavedContent] = useState(initialContent);
  const [showSaved, setShowSaved] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setContent(initialContent);
    setLastSavedContent(initialContent);
  }, [initialContent]);

  useEffect(() => {
    if (content === lastSavedContent) {
      return;
    }

    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }

    saveTimer.current = setTimeout(async () => {
      if (user) {
        await saveNote(day, content);
      } else {
        saveNoteLocal(day, content);
      }

      setLastSavedContent(content);
      setShowSaved(true);

      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }

      hideTimer.current = setTimeout(() => {
        setShowSaved(false);
      }, 1400);
    }, 500);

    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }
    };
  }, [content, day, lastSavedContent, user]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }
    };
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-300">📝 학습 노트</p>
        <span
          className={`text-xs text-emerald-400 transition-opacity duration-300 ${
            showSaved ? "opacity-100" : "opacity-0"
          }`}
        >
          저장됨
        </span>
      </div>
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="오늘 배운 내용, 느낀 점을 메모하세요..."
        className="min-h-24 w-full rounded-lg bg-zinc-950 px-3 py-2 text-sm text-zinc-300 outline-none ring-1 ring-transparent transition focus:ring-zinc-700"
      />
    </div>
  );
}
