import { Navigate, Outlet } from "react-router-dom";
import { useTenant } from "../hooks/use-tenant";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute() {
  const { user, isLoadingUser } = useAuth();
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

  return <Outlet />;
}