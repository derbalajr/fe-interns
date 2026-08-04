import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useCan } from "../hooks/use-can";
import { useTenant } from "../hooks/use-tenant";

type ProtectedRouteProps = {
  permission?: string;
  role?: string;
};

export function ProtectedRoute({
  permission,
  role,
}: ProtectedRouteProps) {
  const { user, isLoadingUser } = useAuth();
  const { can, hasRole, isLoading } = useCan();
  const { tenant, isLoadingTenant } = useTenant();
  const location = useLocation();

  // Wait until auth and tenant finish loading
  if (isLoadingUser || isLoadingTenant) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-sm text-slate-500">Loading workspace...</p>
      </div>
    );
  }

  // User must be authenticated and belong to a tenant
  if (!user || !tenant) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Wait until roles & permissions are loaded
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading permissions...
        </p>
      </div>
    );
  }

  // Permission check
  if (permission && !can(permission)) {
    return <Navigate to="/" replace />;
  }

  // Role check
  if (role && !hasRole(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}