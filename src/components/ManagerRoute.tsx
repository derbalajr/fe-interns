import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import { canManageUsers } from "@/lib/permissions";

/**
 * Guards manager-only areas (e.g. Users). Agents who reach the URL directly
 * are redirected back to the dashboard instead of seeing the page.
 */
export function ManagerRoute() {
  const { user } = useAuth();
  const location = useLocation();

  if (!canManageUsers(user)) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
