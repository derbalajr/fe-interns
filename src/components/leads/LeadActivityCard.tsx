import type { Lead } from "@/types/lead";

import { LeadPanel } from "./LeadPanel";

type LeadActivityCardProps = {
  lead: Lead;
};

type ActivityItem = {
  title: string;
  description: string;
};

export function LeadActivityCard({ lead }: LeadActivityCardProps) {
  const activities: ActivityItem[] = [
    {
      title: `Current stage: ${lead.stage}`,
      description: "Latest pipeline status",
    },
    {
      title: lead.agent
        ? `Lead assigned to ${lead.agent.name}`
        : "Lead has not been assigned",
      description: lead.agent ? "Assigned agent" : "Unassigned",
    },
    {
      title: `Lead created from ${lead.source}`,
      description: new Date(lead.created_at).toLocaleDateString(),
    },
  ];

  return (
    <LeadPanel title="Activity" className="h-full">
      <ol className="space-y-0">
        {activities.map((activity, index) => {
          const isLast = index === activities.length - 1;

          return (
            <li
              key={`${activity.title}-${index}`}
              className="relative flex gap-4 pb-8 last:pb-0"
            >
              {!isLast && (
                <div className="absolute left-[9px] top-5 h-full w-px bg-slate-400" />
              )}

              <div className="relative z-10 mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 border-slate-900 bg-white" />

              <div>
                <p className="text-sm font-medium text-slate-900">
                  {activity.title}
                </p>

                <p className="mt-1 text-xs text-slate-500">
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
