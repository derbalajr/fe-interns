import { Navigate, Outlet } from "react-router-dom";
import { useTenant } from "../hooks/use-tenant";
import { useAuth } from "../context/AuthContext";
import { useCan } from "../hooks/use-can";

type ProtectedRouteProps = {
  permission?: string;
  role?: string;
};

export function ProtectedRoute({
  permission,
  role,
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoadingUser } = useAuth();
  const { can, hasRole, isLoading } = useCan();
  const location = useLocation();
  const { tenant, isLoadingTenant } = useTenant();
  // 1. Block rendering until rehydration finishes!
  if (isLoadingUser || isLoadingTenant) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-sm text-slate-500">Loading workspace...</p>
      </div>
    );
  }

  // 2. Only redirect AFTER loading is complete
  if (!user || !tenant) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (permission && !can(permission)) {
    return <Navigate to="/" replace />;
  }

  if (role && !hasRole(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}