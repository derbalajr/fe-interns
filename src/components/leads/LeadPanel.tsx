import type { ReactNode } from "react";

type LeadPanelProps = {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function LeadPanel({
  title,
  action,
  children,
  className = "",
}: LeadPanelProps) {
  return (
    <section
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      <header className="flex min-h-16 items-center justify-between gap-4 border-b border-slate-200 bg-gradient-to-r from-slate-200/70 via-slate-100/50 to-white px-6">
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>

        {action}
      </header>

      <div className="p-6">{children}</div>
    </section>
  );
}
