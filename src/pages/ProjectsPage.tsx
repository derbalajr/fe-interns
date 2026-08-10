import { ArrowRight, Building2, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { EmptyState } from "@/components/states/EmptyState";
import { useProjectsQuery } from "@/hooks/use-projects-query";
import { getProjectImage } from "@/lib/unit-images";
import type { Project } from "@/types/project";

export function ProjectsPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useProjectsQuery();

  const projects = data?.data ?? [];

  return (
    <section className="mx-auto w-full max-w-[1180px]">
      <div className="mb-7">
        <h1 className="text-[34px] font-semibold tracking-[-0.04em] text-[#171717]">
          Inventory
        </h1>

        <p className="mt-1.5 text-sm text-[#777777]">
          Projects and units across the MarQ portfolio.
        </p>
      </div>

      {isLoading ? (
        <ProjectsGridSkeleton />
      ) : isError ? (
        <div className="flex min-h-[360px] items-center justify-center">
          <div className="text-center">
            <p className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
              Failed to load projects.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 text-sm font-medium text-[#3a6df0] hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No projects yet"
          description="Projects added to the MarQ portfolio will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpen={() => navigate(`/projects/${project.id}`)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[#ececec] bg-white text-left shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)]"
    >
      <div className="relative h-44 w-full overflow-hidden bg-[#f2f2f2]">
        <img
          src={getProjectImage(project)}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-[15px] font-semibold text-[#242424]">
          {project.name}
        </h3>

        {project.location && (
          <p className="mt-1 flex items-center gap-1.5 text-[13px] text-[#8a8a8a]">
            <MapPin className="h-3.5 w-3.5" />
            {project.location}
          </p>
        )}

        {project.description && (
          <p className="mt-2 line-clamp-2 text-[13px] text-[#9a9a9a]">
            {project.description}
          </p>
        )}

        <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-[#3a6df0]">
          View units
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </button>
  );
}

function ProjectsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-[#ececec] bg-white"
        >
          <div className="h-44 w-full animate-pulse bg-[#f0f0f0]" />
          <div className="space-y-2 p-4">
            <div className="h-4 w-1/2 animate-pulse rounded bg-[#f0f0f0]" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-[#f3f3f3]" />
          </div>
        </div>
      ))}
    </div>
  );
}
