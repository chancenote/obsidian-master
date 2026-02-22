"use client";

import { Button } from "@/components/ui/button";
import { useMemo } from "react";

const CONFETTI_COLORS = [
  "#a78bfa", "#7c3aed", "#22c55e", "#facc15",
  "#f472b6", "#38bdf8", "#fb923c", "#e879f9",
];

function generateParticles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 1.2}s`,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: 6 + Math.random() * 6,
    rotation: Math.random() * 360,
    isRound: Math.random() > 0.5,
  }));
}

function generateSparkles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${30 + Math.random() * 40}%`,
    top: `${20 + Math.random() * 40}%`,
    delay: `${Math.random() * 0.8}s`,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: 4 + Math.random() * 4,
  }));
}

type CelebrationOverlayProps = {
  show: boolean;
  message: string;
  icon?: string;
  isCertificate?: boolean;
  onClose: () => void;
};

export function CelebrationOverlay({
  show,
  message,
  icon,
  isCertificate = false,
  onClose,
}: CelebrationOverlayProps) {
  const confetti = useMemo(() => generateParticles(16), []);
  const sparkles = useMemo(() => generateSparkles(8), []);

  if (!show) {
    return null;
  }

  const particleLayer = (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {confetti.map((p) => (
        <div
          key={`c-${p.id}`}
          className="confetti-particle"
          style={{
            left: p.left,
            top: -10,
            animationDelay: p.delay,
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
            borderRadius: p.isRound ? "50%" : "2px",
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
      {sparkles.map((s) => (
        <div
          key={`s-${s.id}`}
          className="sparkle-particle"
          style={{
            left: s.left,
            top: s.top,
            animationDelay: s.delay,
            backgroundColor: s.color,
            width: s.size,
            height: s.size,
          }}
        />
      ))}
    </div>
  );

  if (isCertificate) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
        {particleLayer}
        <div className="relative w-full max-w-lg rounded-2xl border-2 border-violet-500 bg-gradient-to-b from-zinc-900 to-zinc-950 p-8 text-center shadow-2xl shadow-violet-900/30">
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
      {particleLayer}
      <div className="relative w-full max-w-sm rounded-xl border border-border bg-card p-6 text-center shadow-xl">
        {icon ? (
          <div className="mb-4 text-5xl" aria-hidden="true">
            {icon}
          </div>
        ) : (
          <div className="mb-4 flex justify-center gap-2 text-3xl" aria-hidden="true">
            <span className="animate-bounce [animation-delay:0ms]">🎉</span>
            <span className="animate-bounce [animation-delay:120ms]">✨</span>
            <span className="animate-bounce [animation-delay:240ms]">🎊</span>
          </div>
        )}
        <p className="mb-4 text-base font-medium">{message}</p>
        <Button type="button" onClick={onClose}>
          닫기
        </Button>
      </div>
    </div>
  );
}
