'use server'

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type AuthActionState = {
  error?: string;
  success?: string;
};

export async function signIn(formData: FormData): Promise<AuthActionState | void> {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: error.message };
  }

  redirect("/");
}

export async function signUp(formData: FormData): Promise<AuthActionState | void> {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    return { error: error.message };
  }

  // 이메일 확인이 비활성화된 경우 세션이 즉시 반환됨 → 홈으로 이동
  if (data.session) {
    redirect("/");
  }

  // 이메일 확인이 필요한 경우
  return { success: "확인 이메일을 보냈습니다. 이메일을 확인해주세요." };
}
