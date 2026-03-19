"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  KEYS,
  loadProgress,
  loadNotes,
  loadMilestones,
} from "@/lib/storage/local";
import { checkServerData, migrateFromLocal } from "@/app/actions/migrate";

type MigrationState =
  | "idle"
  | "checking"
  | "migrating"
  | "conflict"
  | "success"
  | "error";

export function MigrationHandler() {
  const [state, setState] = useState<MigrationState>("idle");
  const [message, setMessage] = useState("");

  const hasLocalData = useCallback(() => {
    const progress = loadProgress();
    const notes = loadNotes();
    const milestones = loadMilestones();
    return (
      Object.keys(progress).length > 0 ||
      Object.keys(notes).length > 0 ||
      milestones.length > 0
    );
  }, []);

  const getLocalData = useCallback(
    () => ({
      progress: loadProgress(),
      notes: loadNotes(),
      milestones: loadMilestones(),
    }),
    []
  );

  const runMigration = useCallback(
    async (overwrite: boolean) => {
      setState("migrating");
      const localData = getLocalData();
      const result = await migrateFromLocal(localData, overwrite);

      if (result.error) {
        setState("error");
        setMessage(result.error);
        return;
      }

      // Set migrated flag
      localStorage.setItem(KEYS.MIGRATED, new Date().toISOString());

      setState("success");
      if (result.migrated) {
        setMessage(
          `진행도 ${result.migrated.progress}개, 노트 ${result.migrated.notes}개, 마일스톤 ${result.migrated.milestones}개가 동기화되었습니다.`
        );
      }

      // Auto-dismiss after 3 seconds and reload
      setTimeout(() => {
        setState("idle");
        window.location.reload();
      }, 3000);
    },
    [getLocalData]
  );

  const handleKeepServer = useCallback(() => {
    localStorage.setItem(KEYS.MIGRATED, new Date().toISOString());
    setState("idle");
  }, []);

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      if (event !== "SIGNED_IN") return;

      // Check migrated flag (task 11.2)
      const migrated = localStorage.getItem(KEYS.MIGRATED);
      if (migrated) return;

      // Check if local data exists (task 11.6 — skip silently when empty)
      if (!hasLocalData()) return;

      setState("checking");

      // Check server data
      const serverResult = await checkServerData();
      if (serverResult.error) {
        setState("error");
        setMessage(serverResult.error);
        return;
      }

      if (!serverResult.hasData) {
        // No server data — auto-migrate (task 11.3)
        await runMigration(false);
      } else {
        // Both exist — show conflict resolution (task 11.4)
        setState("conflict");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [hasLocalData, runMigration]);

  if (state === "idle") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl">
        {state === "checking" && (
          <div className="text-center">
            <div className="mb-3 text-2xl">🔍</div>
            <div className="mb-2 text-lg font-semibold text-zinc-100">
              데이터 확인 중...
            </div>
            <p className="text-sm text-zinc-400">
              로컬 학습 데이터를 확인하고 있습니다.
            </p>
          </div>
        )}

        {state === "migrating" && (
          <div className="text-center">
            <div className="mb-3 text-2xl">⏳</div>
            <div className="mb-2 text-lg font-semibold text-zinc-100">
              데이터 동기화 중...
            </div>
            <p className="text-sm text-zinc-400">
              로컬 데이터를 서버로 옮기고 있습니다.
            </p>
          </div>
        )}

        {state === "conflict" && (
          <div>
            <div className="mb-3 text-center text-2xl">⚠️</div>
            <div className="mb-2 text-center text-lg font-semibold text-zinc-100">
              데이터 충돌 감지
            </div>
            <p className="mb-5 text-center text-sm text-zinc-400">
              로컬 브라우저와 서버 모두에 학습 데이터가 있습니다.
              <br />
              어떤 데이터를 사용하시겠습니까?
            </p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleKeepServer}
                className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-700"
              >
                서버 데이터 유지
              </button>
              <button
                type="button"
                onClick={() => runMigration(true)}
                className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-500"
              >
                로컬 데이터로 덮어쓰기
              </button>
            </div>
          </div>
        )}

        {state === "success" && (
          <div className="text-center">
            <div className="mb-3 text-2xl">✅</div>
            <div className="mb-2 text-lg font-semibold text-emerald-400">
              마이그레이션 완료!
            </div>
            <p className="text-sm text-zinc-400">{message}</p>
          </div>
        )}

        {state === "error" && (
          <div className="text-center">
            <div className="mb-3 text-2xl">❌</div>
            <div className="mb-2 text-lg font-semibold text-red-400">
              오류 발생
            </div>
            <p className="mb-4 text-sm text-zinc-400">{message}</p>
            <button
              type="button"
              onClick={() => setState("idle")}
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-700"
            >
              닫기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
