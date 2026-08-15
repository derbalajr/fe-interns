import { useState } from "react";

import {
  CalendarCheck,
  CheckCircle2,
  Clock3,
  CalendarDays,
} from "lucide-react";

import { useHandoversQuery } from "@/hooks/use-handovers-query";
import { useCompleteHandoverMutation } from "@/hooks/use-complete-handover-mutation";
import { ScheduleHandoverDialog } from "@/components/handovers/ScheduleHandoverDialog";

export function HandoversPage() {
  const { data } = useHandoversQuery();

  const completeHandoverMutation =
    useCompleteHandoverMutation();

  const [activeTab, setActiveTab] = useState<
    "upcoming" | "completed" | "cancelled"
  >("upcoming");

  const [isScheduleDialogOpen, setIsScheduleDialogOpen] =
    useState(false);

  const handovers = data?.data ?? [];

  const upcomingHandovers = handovers.filter(
    (handover) => handover.status === "scheduled",
  );

  const completedHandovers = handovers.filter(
    (handover) => handover.status === "completed",
  );

  const thisMonthHandovers = handovers.filter((handover) => {
    const handoverDate = new Date(handover.handover_date);
    const now = new Date();

    return (
      handoverDate.getMonth() === now.getMonth() &&
      handoverDate.getFullYear() === now.getFullYear()
    );
  });

  return (
    <section className="mx-auto w-full max-w-[1548px]">
      {/* Header */}
      <div className="mb-7 flex items-start justify-between">
        <div>
          <h1 className="text-[36px] font-medium tracking-[-0.03em] text-black">
            Handovers
          </h1>

          <p className="mt-1 text-sm text-[#626262]">
            Schedule and track units being handed over.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsScheduleDialogOpen(true)}
          className="flex h-[61px] items-center gap-3 rounded-2xl border border-[#ededed] bg-black/80 px-5 text-base font-medium text-white shadow-[0_2px_5px_rgba(98,98,98,0.2)]"
        >
          <CalendarCheck size={18} />
          Schedule Handover
          <span className="text-xl">→</span>
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={CalendarDays}
          label="Upcoming"
          value={String(upcomingHandovers.length)}
          description={
            upcomingHandovers.length === 0
              ? "No handovers scheduled"
              : "Handovers scheduled"
          }
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Completed"
          value={String(completedHandovers.length)}
          description="Total completed"
        />

        <SummaryCard
          icon={Clock3}
          label="Delayed"
          value="0"
          description="Needs attention"
        />

        <SummaryCard
          icon={CalendarDays}
          label="This month"
          value={String(thisMonthHandovers.length)}
          description="Handovers"
        />
      </div>

      {/* Handovers panel */}
      <div className="mt-8 rounded-2xl bg-[#fbfbfb] p-6 shadow-[1px_2px_9px_2px_rgba(98,98,98,0.15)]">
        <div className="flex items-center justify-between">
          {/* Tabs */}
          <div className="flex items-center gap-10">
            <button
              type="button"
              onClick={() => setActiveTab("upcoming")}
              className={`pb-3 text-lg font-medium text-black ${
                activeTab === "upcoming"
                  ? "border-b-2 border-[#e4e4e7]"
                  : ""
              }`}
            >
              Upcoming

              <span className="ml-2 inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-[#e4e4e7] px-2 text-sm">
                {upcomingHandovers.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("completed")}
              className={`pb-3 text-lg font-medium text-black ${
                activeTab === "completed"
                  ? "border-b-2 border-[#e4e4e7]"
                  : ""
              }`}
            >
              Completed

              <span className="ml-2 inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-[#e4e4e7] px-2 text-sm">
                {completedHandovers.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("cancelled")}
              className={`pb-3 text-lg font-medium text-black ${
                activeTab === "cancelled"
                  ? "border-b-2 border-[#e4e4e7]"
                  : ""
              }`}
            >
              Cancelled

              <span className="ml-2 inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-[#e4e4e7] px-2 text-sm">
                0
              </span>
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex h-[50px] items-center gap-2 rounded-2xl border border-[#ededed] bg-[#f7f7f7]/50 px-4 text-[#626262] shadow-[0_2px_5px_rgba(98,98,98,0.2)]"
            >
              <CalendarDays size={20} />
              Previous 30 Days
              <span>⌄</span>
            </button>

            <button
              type="button"
              className="flex h-[50px] items-center gap-2 rounded-2xl border border-[#ededed] bg-[#f7f7f7]/50 px-5 text-[#626262] shadow-[0_2px_5px_rgba(98,98,98,0.2)]"
            >
              Filter
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 grid grid-cols-[1.8fr_1fr] gap-7">
          {/* Main area */}
          <div className="min-h-[460px] rounded-2xl border border-black/10">
            {/* Upcoming */}
            {activeTab === "upcoming" && (
              <div className="p-6">
                {upcomingHandovers.length === 0 ? (
                  <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
                    <CalendarDays
                      size={70}
                      strokeWidth={1.4}
                      className="text-[#9c9c9c]"
                    />

                    <p className="mt-5 text-xl font-medium text-black">
                      No handovers scheduled yet
                    </p>

                    <p className="mt-2 text-sm text-[#626262]">
                      When a reserved unit is ready,
                      schedule its handover here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingHandovers.map((handover) => (
                      <div
                        key={handover.id}
                        className="flex items-center justify-between rounded-2xl border border-black/10 p-5"
                      >
                        <div>
                          <p className="text-lg font-medium text-black">
                            {handover.unit?.code
                              ? `Unit ${handover.unit.code}`
                              : `Unit #${handover.unit_id}`}
                          </p>

                          <p className="mt-1 text-sm text-[#626262]">
                            Handover date:{" "}
                            {handover.handover_date}
                          </p>

                          {handover.notes && (
                            <p className="mt-1 text-sm text-[#626262]">
                              {handover.notes}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="rounded-full bg-[#fff4d6] px-4 py-2 text-sm font-medium text-[#8a6d1d]">
                            Scheduled
                          </span>

                          <button
                            type="button"
                            disabled={
                              completeHandoverMutation.isPending
                            }
                            onClick={() =>
                              completeHandoverMutation.mutate(
                                handover.id,
                              )
                            }
                            className="rounded-xl bg-black/80 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {completeHandoverMutation.isPending
                              ? "Completing..."
                              : "Mark completed"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Completed */}
            {activeTab === "completed" && (
              <div className="p-6">
                {completedHandovers.length === 0 ? (
                  <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
                    <CheckCircle2
                      size={70}
                      strokeWidth={1.4}
                      className="text-[#9c9c9c]"
                    />

                    <p className="mt-5 text-xl font-medium text-black">
                      No completed handovers yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {completedHandovers.map((handover) => (
                      <div
                        key={handover.id}
                        className="flex items-center justify-between rounded-2xl border border-black/10 p-5"
                      >
                        <div>
                          <p className="text-lg font-medium text-black">
                            {handover.unit?.code
                              ? `Unit ${handover.unit.code}`
                              : `Unit #${handover.unit_id}`}
                          </p>

                          <p className="mt-1 text-sm text-[#626262]">
                            Handover date:{" "}
                            {handover.handover_date}
                          </p>

                          {handover.notes && (
                            <p className="mt-1 text-sm text-[#626262]">
                              {handover.notes}
                            </p>
                          )}
                        </div>

                        <span className="rounded-full bg-[rgba(72,230,175,0.1)] px-4 py-2 text-sm font-medium text-[#1f7753]">
                          Completed
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Cancelled */}
            {activeTab === "cancelled" && (
              <div className="flex min-h-[430px] flex-col items-center justify-center p-6 text-center">
                <p className="text-xl font-medium text-black">
                  No cancelled handovers
                </p>

                <p className="mt-2 text-sm text-[#626262]">
                  Cancelled handovers are not currently
                  supported by the backend.
                </p>
              </div>
            )}
          </div>

          {/* Recent handovers */}
          <div className="min-h-[460px] rounded-2xl border border-black/10">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-lg font-medium text-black">
                  Recent Handovers
                </p>

                <button
                  type="button"
                  className="text-sm text-[#626262]"
                >
                  View All →
                </button>
              </div>

              {completedHandovers.length === 0 ? (
                <p className="mt-8 text-sm text-[#626262]">
                  No recent handovers.
                </p>
              ) : (
                <div className="mt-6 space-y-5">
                  {completedHandovers
                    .slice(0, 3)
                    .map((handover) => (
                      <div
                        key={handover.id}
                        className="flex items-start justify-between gap-4"
                      >
                        <div>
                          <p className="font-medium text-black">
                            {handover.unit?.code
                              ? `Unit ${handover.unit.code}`
                              : `Unit #${handover.unit_id}`}
                          </p>

                          <p className="mt-1 text-sm text-[#626262]">
                            {handover.handover_date}
                          </p>
                        </div>

                        <span className="rounded-full bg-[rgba(72,230,175,0.1)] px-3 py-1 text-xs font-medium text-[#1f7753]">
                          Completed
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule modal */}
      <ScheduleHandoverDialog
        open={isScheduleDialogOpen}
        onClose={() => setIsScheduleDialogOpen(false)}
      />
    </section>
  );
}

type SummaryCardProps = {
  icon: React.ElementType;
  label: string;
  value: string;
  description: string;
};

function SummaryCard({
  icon: Icon,
  label,
  value,
  description,
}: SummaryCardProps) {
  return (
    <div className="flex h-[124px] items-center rounded-2xl border border-[#ededed] bg-[#f8f8f8]/50 px-7 shadow-[0_2px_5px_rgba(0,0,0,0.12)]">
      <div className="flex h-[69px] w-[73px] shrink-0 items-center justify-center rounded-xl bg-[#4b4b4b]">
        <Icon
          size={42}
          strokeWidth={1.6}
          className="text-white"
        />
      </div>

      <div className="ml-[18px]">
        <p className="text-sm font-medium capitalize text-[#626262]">
          {label}
        </p>

        <p className="mt-1 text-2xl font-medium text-black">
          {value}
        </p>

        <p className="mt-1 text-sm text-[#626262]">
          {description}
        </p>
      </div>
    </div>
  );
}