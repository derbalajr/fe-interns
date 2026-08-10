import { useMemo, useState } from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { UnitStatusBadge } from "@/components/units/UnitStatusBadge";
import { EmptyState } from "@/components/states/EmptyState";
import { ApiError } from "@/lib/fetcher";
import { formatCurrency } from "@/lib/format";
import { getUnitGallery } from "@/lib/unit-images";
import { useUnitQuery } from "@/hooks/use-unit-query";
import { formatUnitArea, getProjectName } from "@/utils/unit";

export function UnitDetailPage() {
  const navigate = useNavigate();
  const { unitId = "" } = useParams();

  const { data: unit, isLoading, isError, error } = useUnitQuery(unitId);

  const gallery = useMemo(
    () => (unit ? getUnitGallery(unit, 5) : []),
    [unit],
  );
  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) {
    return (
      <div className="flex min-h-[520px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#dddddd] border-t-[#222222]" />
          <p className="mt-4 text-sm text-[#777777]">Loading unit…</p>
        </div>
      </div>
    );
  }

  const isNotFound = error instanceof ApiError && error.status === 404;

  if (isError || !unit) {
    return (
      <section className="mx-auto w-full max-w-[1180px]">
        <BackButton onClick={() => navigate(-1)} />
        <EmptyState
          title={isNotFound ? "Unit not found" : "Failed to load unit"}
          description={
            isNotFound
              ? "This unit may have been removed or the link is incorrect."
              : "Something went wrong while loading this unit. Please try again."
          }
        />
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-[1180px]">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <BackButton onClick={() => navigate(-1)} />

          <h1 className="mt-3 text-[30px] font-semibold tracking-[-0.03em] text-[#171717]">
            {getProjectName(unit)} — {unit.code}
          </h1>

          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-[#777777]">
            <span>{unit.type}</span>
            {unit.project?.location && (
              <>
                <span className="text-[#cccccc]">·</span>
                <MapPin className="h-4 w-4" />
                <span>{unit.project.location}</span>
              </>
            )}
          </p>
        </div>

        <UnitStatusBadge status={unit.status} className="px-3 py-1.5 text-xs" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Gallery */}
        <div>
          <div className="overflow-hidden rounded-2xl bg-[#f2f2f2]">
            <img
              src={gallery[activeImage]}
              alt={`${unit.code} photo ${activeImage + 1}`}
              className="aspect-[16/10] w-full object-cover"
            />
          </div>

          <div className="mt-3 grid grid-cols-4 gap-3">
            {gallery.slice(1, 5).map((src, index) => {
              const imageIndex = index + 1;

              return (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActiveImage(imageIndex)}
                  className={`overflow-hidden rounded-xl border-2 transition ${
                    activeImage === imageIndex
                      ? "border-[#3a6df0]"
                      : "border-transparent hover:border-[#dddddd]"
                  }`}
                >
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    className="aspect-square w-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Details panel */}
        <aside className="rounded-2xl border border-[#ececec] bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
          <h2 className="text-sm font-semibold text-[#242424]">Details</h2>

          <dl className="mt-4 divide-y divide-[#f0f0f0]">
            <DetailRow
              label="Price"
              value={
                <span className="font-semibold text-[#171717]">
                  {formatCurrency(Number(unit.price))}
                </span>
              }
            />
            <DetailRow label="Type" value={unit.type} />
            <DetailRow label="Area" value={formatUnitArea(unit.area)} />
            <DetailRow
              label="Location"
              value={unit.project?.location ?? "—"}
            />
            <DetailRow
              label="Status"
              value={<UnitStatusBadge status={unit.status} />}
            />
          </dl>
        </aside>
      </div>
    </section>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-3 text-sm">
      <dt className="text-[#8a8a8a]">{label}</dt>
      <dd className="text-right text-[#333333]">{value}</dd>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-sm text-[#777777] transition hover:text-[#333333]"
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </button>
  );
}
