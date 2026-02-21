"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useState } from "react";
import { type AuthActionState, signIn, signUp } from "./actions";

type AuthMode = "sign-in" | "sign-up";

const initialState: AuthActionState = {};

function validateCredentials(email: string, password: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return "올바른 이메일 형식을 입력해주세요.";
  }

  if (password.length < 6) {
    return "비밀번호는 6자 이상이어야 합니다.";
  }

  return null;
}

export function LoginForm() {
  const [mode, setMode] = useState<AuthMode>("sign-in");

  const [state, formAction, isPending] = useActionState(
    async (_prevState: AuthActionState | void, formData: FormData) => {
      const email = String(formData.get("email") ?? "").trim();
      const password = String(formData.get("password") ?? "");

      const validationError = validateCredentials(email, password);
      if (validationError) {
        return { error: validationError };
      }

      formData.set("email", email);

      if (mode === "sign-in") {
        const result = await signIn(formData);
        return result ?? {};
      }

      return signUp(formData);
    },
    initialState,
  );

  return (
    <Card>
      <CardHeader>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={mode === "sign-in" ? "default" : "outline"}
            onClick={() => setMode("sign-in")}
          >
            로그인
          </Button>
          <Button
            type="button"
            variant={mode === "sign-up" ? "default" : "outline"}
            onClick={() => setMode("sign-up")}
          >
            회원가입
          </Button>
        </div>
        <CardTitle className="pt-4">
          {mode === "sign-in" ? "계정에 로그인" : "새 계정 만들기"}
        </CardTitle>
        <CardDescription>
          {mode === "sign-in"
            ? "이메일과 비밀번호로 로그인하세요."
            : "이메일 인증 후 서비스를 사용할 수 있습니다."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          {state && "error" in state && state.error ? (
            <p className="text-sm text-destructive">{state.error}</p>
          ) : null}
          {state && "success" in state && state.success ? (
            <p className="text-sm text-emerald-500">{state.success}</p>
          ) : null}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending
              ? "처리 중..."
              : mode === "sign-in"
                ? "로그인"
                : "회원가입"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
