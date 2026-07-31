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
      className={`overflow-hidden rounded-2xl border border-[#e6e6e6] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${className}`}
    >
      <header className="flex min-h-[54px] items-center justify-between gap-4 border-b border-[#ececec] bg-gradient-to-r from-[#f8f8f8] via-[#fbfbfb] to-white px-5">
        <h2 className="text-[14px] font-semibold text-[#252525]">
          {title}
        </h2>

        {action}
      </header>

      <div className="p-5">{children}</div>
    </section>
  );
}