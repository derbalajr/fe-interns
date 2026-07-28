export function formatCurrency(value: number) {
  if (value >= 1_000_000) {
    return `EGP ${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `EGP ${(value / 1000).toFixed(0)}K`;
  }

  return `EGP ${value}`;
}

export function formatDealDate(date?: string | null) {
  if (!date) return "--";

  const d = new Date(date);
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);

  const diff =
    (d.getTime() - today.getTime()) / 86400000;

  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";

  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}