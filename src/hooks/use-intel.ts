import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  getDeliveryPipeline,
  getLaunches,
  getMarketShare,
  getPaymentTerms,
  getPriceDistribution,
  getProject,
  getProjects,
  getWhitespace,
  getZones,
  type LaunchesParams,
  type ProjectsParams,
} from "@/api/intelApi";

// The underlying data only changes when a collection run finishes, so the guide
// (section 6) says everything on the Overview is cacheable for ~5 minutes.
const FIVE_MINUTES = 5 * 60 * 1000;

export const intelQueryKey = ["intel"] as const;

export function useMarketShareQuery(limit = 10) {
  return useQuery({
    queryKey: [...intelQueryKey, "market-share", limit],
    queryFn: () => getMarketShare(limit),
    staleTime: FIVE_MINUTES,
  });
}

export function useZonesQuery(limit = 15) {
  return useQuery({
    queryKey: [...intelQueryKey, "zones", limit],
    queryFn: () => getZones(limit),
    staleTime: FIVE_MINUTES,
  });
}

export function usePriceDistributionQuery() {
  return useQuery({
    queryKey: [...intelQueryKey, "price-distribution"],
    queryFn: () => getPriceDistribution(),
    staleTime: FIVE_MINUTES,
  });
}

export function useDeliveryPipelineQuery() {
  return useQuery({
    queryKey: [...intelQueryKey, "delivery-pipeline"],
    queryFn: () => getDeliveryPipeline(),
    staleTime: FIVE_MINUTES,
  });
}

export function useWhitespaceQuery(minProjects = 5, limit = 10) {
  return useQuery({
    queryKey: [...intelQueryKey, "whitespace", minProjects, limit],
    queryFn: () => getWhitespace(minProjects, limit),
    staleTime: FIVE_MINUTES,
  });
}

export function usePaymentTermsQuery(limit = 15) {
  return useQuery({
    queryKey: [...intelQueryKey, "payment-terms", limit],
    queryFn: () => getPaymentTerms(limit),
    staleTime: FIVE_MINUTES,
  });
}

export function useLaunchesQuery(params: LaunchesParams = {}) {
  return useQuery({
    queryKey: [...intelQueryKey, "launches", params],
    queryFn: () => getLaunches(params),
    staleTime: FIVE_MINUTES,
  });
}

export function useProjectsQuery(params: ProjectsParams = {}) {
  return useQuery({
    queryKey: [...intelQueryKey, "projects", params],
    queryFn: () => getProjects(params),
    staleTime: FIVE_MINUTES,
    placeholderData: keepPreviousData,
  });
}

export function useProjectQuery(id: string | undefined) {
  return useQuery({
    queryKey: [...intelQueryKey, "project", id],
    queryFn: () => getProject(id as string),
    enabled: Boolean(id),
    staleTime: FIVE_MINUTES,
  });
}
