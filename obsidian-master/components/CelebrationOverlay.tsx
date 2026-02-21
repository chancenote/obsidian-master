"use client";

import { Button } from "@/components/ui/button";

type CelebrationOverlayProps = {
  show: boolean;
  message: string;
  isCertificate?: boolean;
  onClose: () => void;
};

export function CelebrationOverlay({
  show,
  message,
  isCertificate = false,
  onClose,
}: CelebrationOverlayProps) {
  if (!show) {
    return null;
  }

  if (isCertificate) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
        <div className="w-full max-w-lg rounded-2xl border-2 border-violet-500 bg-gradient-to-b from-zinc-900 to-zinc-950 p-8 text-center shadow-2xl shadow-violet-900/30">
          <div className="mb-3 text-5xl">🏆</div>
          <h2 className="mb-1 text-2xl font-extrabold text-violet-300">
            수료 인증서
          </h2>
          <p className="mb-4 text-sm text-zinc-500">Certificate of Completion</p>
          <div className="mx-auto mb-4 h-px w-24 bg-violet-500/40" />
          <p className="mb-2 text-lg font-bold text-zinc-100">
            30일 옵시디언 마스터 과정
          </p>
          <p className="mb-1 text-sm text-zinc-400">
            모든 학습을 완료하셨습니다!
          </p>
          <p className="mb-6 text-xs text-zinc-600">
            {new Date().toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <Button type="button" onClick={onClose}>
            닫기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 text-center shadow-xl">
        <div className="mb-4 flex justify-center gap-2 text-3xl" aria-hidden="true">
          <span className="animate-bounce [animation-delay:0ms]">🎉</span>
          <span className="animate-bounce [animation-delay:120ms]">✨</span>
          <span className="animate-bounce [animation-delay:240ms]">🎊</span>
        </div>
        <p className="mb-4 text-base font-medium">{message}</p>
        <Button type="button" onClick={onClose}>
          닫기
        </Button>
      </div>
    </div>
  );
}
