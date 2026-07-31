import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useTenant } from "@/hooks/use-tenant";
import { useAuth } from "@/context/AuthContext";
import type { TenantId } from "@/constants/tenants";

type TenantRouteProps = {
  allowedTenant: TenantId;
  children: ReactNode;
};

export function TenantRoute({ allowedTenant, children }: TenantRouteProps) {
  const { isLoadingUser, user } = useAuth();
  const { tenant, isLoadingTenant } = useTenant();
  const location = useLocation();

  if (isLoadingUser || isLoadingTenant) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm font-medium text-slate-600">
        Loading your workspace...
      </div>
    );
  }

  // If user has no valid tenant, redirect to login instead of "/" to prevent layout loops
  if (user && !tenant) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (tenant?.id !== allowedTenant) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
