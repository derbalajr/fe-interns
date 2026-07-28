import { LayoutGrid, List } from "lucide-react";

interface ViewSwitcherProps {
  view?: "grid" | "list";
}

export function ViewSwitcher({
  view = "grid",
}: ViewSwitcherProps) {
  return (
    <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
      <button
        className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
          view === "grid"
            ? "bg-slate-100 text-slate-900"
            : "text-slate-500 hover:bg-slate-50"
        }`}
      >
        <LayoutGrid size={18} />
      </button>

      <button
        className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
          view === "list"
            ? "bg-slate-100 text-slate-900"
            : "text-slate-500 hover:bg-slate-50"
        }`}
      >
        <List size={18} />
      </button>
    </div>
  );
}