import { Navigate, Outlet, useLocation } from "react-router-dom";

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
  const { isAuthenticated } = useAuth();
  const { can, hasRole, isLoading } = useCan();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
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