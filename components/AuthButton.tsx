"use client";

import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";

type AuthButtonProps = {
  user: User | null;
};

export function AuthButton({ user }: AuthButtonProps) {
  if (!user) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link href="/login">로그인</Link>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="max-w-[180px] truncate text-sm text-muted-foreground">
        {user.email}
      </span>
      <form action={signOut}>
        <Button type="submit" variant="outline" size="sm">
          로그아웃
        </Button>
      </form>
    </div>
  );
}
