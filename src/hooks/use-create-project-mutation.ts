import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createProject } from "@/api/projectApi";
import { projectsQueryKey } from "@/hooks/use-projects-query";
import type { ProjectPayload } from "@/schemas/project-schema";

export function useCreateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProjectPayload) => createProject(data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: projectsQueryKey });
    },
  });
}
