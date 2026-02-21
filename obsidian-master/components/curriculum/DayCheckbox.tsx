"use client";

import { toggleDay } from "@/app/actions/progress";
import { toggleDayLocal } from "@/lib/storage/local";
import type { User } from "@supabase/supabase-js";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

type DayCheckboxProps = {
  day: number;
  checked: boolean;
  user: User | null;
  onToggle: (day: number) => void;
};

export function DayCheckbox({ day, checked, user, onToggle }: DayCheckboxProps) {
  const [optimisticChecked, setOptimisticChecked] = useState(checked);

  useEffect(() => {
    setOptimisticChecked(checked);
  }, [checked]);

  const handleToggle = async () => {
    const next = !optimisticChecked;
    setOptimisticChecked(next);
    onToggle(day);

    try {
      if (user) {
        await toggleDay(day);
      } else {
        toggleDayLocal(day);
      }
    } catch {
      setOptimisticChecked(!next);
      onToggle(day);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={`Day ${day} 완료 토글`}
      aria-pressed={optimisticChecked}
      className={`flex h-[22px] w-[22px] items-center justify-center rounded-md border transition-colors ${
        optimisticChecked
          ? "border-violet-600 bg-violet-600 text-white"
          : "border-zinc-700 bg-transparent text-transparent"
      }`}
    >
      <Check className="h-3.5 w-3.5" />
    </button>
  );
}
