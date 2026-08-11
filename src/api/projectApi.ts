import { apiGet, apiPost } from "@/lib/fetcher";

import type { ProjectPayload } from "@/schemas/project-schema";
import type { ProjectResponse, ProjectsResponse } from "@/types/project";

const PER_PAGE = 100;

export function getProjects(page = 1) {
  const params = new URLSearchParams();

  params.set("page", page.toString());
  params.set("per_page", PER_PAGE.toString());

  return apiGet<ProjectsResponse>(`/projects?${params.toString()}`);
}

export function getProject(id: number | string) {
  return apiGet<ProjectResponse>(`/projects/${id}`);
}

export function createProject(data: ProjectPayload) {
  return apiPost<ProjectResponse, ProjectPayload>("/projects", data);
}
