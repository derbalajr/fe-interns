import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useTenant } from "../hooks/use-tenant";

export function PublicOnlyRoute() {
  const { isAuthenticated, isLoadingUser } = useAuth();
  const { tenant, isLoadingTenant } = useTenant();

  if (isLoadingUser || isLoadingTenant) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm font-medium text-slate-600">
        Loading your workspace...
      </div>
    );
  }

  // Only redirect if authenticated AND has a valid tenant
  // If authenticated but no valid tenant, stay on login (user may need to re-login with correct workspace)
  if (isAuthenticated && tenant) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
