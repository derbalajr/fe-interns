import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

interface FilterButtonProps {
  label: string;
  icon?: ReactNode;
}

export function FilterButton({
  label,
  icon,
}: FilterButtonProps) {
  return (
    <button className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:shadow">
      {icon}

      <span>{label}</span>

      <ChevronDown
        size={16}
        className="text-slate-400"
      />
    </button>
  );
}