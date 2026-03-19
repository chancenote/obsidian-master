import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { AuthButton } from "./AuthButton";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-bold">
            Obsidian Master
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/" className="hover:text-foreground/80">
              대시보드
            </Link>
            <Link href="/curriculum" className="hover:text-foreground/80">
              커리큘럼
            </Link>
            <Link href="/youtube" className="hover:text-foreground/80">
              YouTube
            </Link>
          </nav>
        </div>
        <AuthButton user={user} />
      </div>
    </header>
  );
}
