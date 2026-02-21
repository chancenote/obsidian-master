"use client";

import type { User } from "@supabase/supabase-js";
import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const DISMISS_KEY = "obsidian-mastery-banner-dismissed";

type LoginBannerProps = {
  user: User | null;
};

export function LoginBanner({ user }: LoginBannerProps) {
  const [isReady, setIsReady] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISS_KEY) === "true";
    setIsDismissed(dismissed);
    setIsReady(true);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, "true");
    setIsDismissed(true);
  };

  if (user || !isReady || isDismissed) {
    return null;
  }

  return (
    <div className="mb-6 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-amber-100">
          로그인하면 진도를 서버에 저장하고 다른 기기에서도 이어서 학습할 수 있어요{" "}
          <Link href="/login" className="font-semibold underline underline-offset-2">
            로그인하기
          </Link>
        </p>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="배너 닫기"
          className="rounded p-1 text-amber-100/80 transition-colors hover:bg-amber-100/10 hover:text-amber-50"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
