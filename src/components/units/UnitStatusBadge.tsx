import { cn } from "@/lib/utils";
import type { UnitStatus } from "@/types/unit";
import { getUnitStatusLabel } from "@/utils/unit";

const STATUS_STYLES: Record<UnitStatus, string> = {
  available: "bg-[#e7f6ec] text-[#1f9d55]",
  reserved: "bg-[#fdf1dc] text-[#b7791f]",
  sold: "bg-[#fdecec] text-[#d64545]",
};

type UnitStatusBadgeProps = {
  status: UnitStatus | string;
  className?: string;
};

export function UnitStatusBadge({ status, className }: UnitStatusBadgeProps) {
  const style =
    STATUS_STYLES[status as UnitStatus] ?? "bg-[#eeeeee] text-[#555555]";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
        style,
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {getUnitStatusLabel(status)}
    </span>
  );
}
