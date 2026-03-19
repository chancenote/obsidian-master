import Link from "next/link";
import { Suspense } from "react";

export default function AuthErrorPage() {
  return (
    <Suspense>
      <AuthErrorContent />
    </Suspense>
  );
}

async function AuthErrorContent({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const error = params.error;

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <div className="mb-4 text-4xl">⚠️</div>
      <h1 className="mb-2 text-xl font-bold text-zinc-100">인증 오류</h1>
      <p className="mb-6 max-w-md text-sm text-zinc-400">
        {error ?? "인증 처리 중 문제가 발생했습니다. 다시 시도해주세요."}
      </p>
      <Link
        href="/login"
        className="rounded-lg bg-violet-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-500"
      >
        로그인 페이지로 이동
      </Link>
    </div>
  );
}
