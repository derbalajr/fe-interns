import type { Lead } from "@/types/lead";

import { LeadPanel } from "./LeadPanel";

type LeadActivityCardProps = {
  lead: Lead;
};

type ActivityItem = {
  title: string;
  description: string;
};

function formatValue(value: string): string {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function LeadActivityCard({
  lead,
}: LeadActivityCardProps) {
  const createdDate = new Date(
    lead.created_at,
  ).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const activities: ActivityItem[] = [
    {
      title: `Stage Moved To ${formatValue(lead.stage)}`,
      description: lead.agent
        ? `${lead.agent.name} · Latest Status`
        : "Latest Pipeline Status",
    },
    {
      title: lead.agent
        ? `Lead Assigned To ${lead.agent.name}`
        : "Lead Is Currently Unassigned",
      description: lead.agent
        ? "Assigned Agent"
        : "No Agent Assigned",
    },
    {
      title: `Lead Created From ${formatValue(lead.source)}`,
      description: createdDate,
    },
  ];

  return (
    <LeadPanel title="Activity" className="h-full">
      <ol>
        {activities.map((activity, index) => {
          const isLast =
            index === activities.length - 1;

          return (
            <li
              key={`${activity.title}-${index}`}
              className="relative flex gap-4 pb-7 last:pb-0"
            >
              {!isLast && (
                <div className="absolute left-[8px] top-4 h-full w-px bg-[#555555]" />
              )}

              <div className="relative z-10 mt-0.5 h-[18px] w-[18px] shrink-0 rounded-full border-[1.5px] border-[#222222] bg-white" />

              <div className="min-w-0">
                <p className="text-xs font-medium leading-5 text-[#333333]">
                  {activity.title}
                </p>

                <p className="mt-0.5 text-[10px] text-[#858585]">
                  {activity.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </LeadPanel>
  );
}