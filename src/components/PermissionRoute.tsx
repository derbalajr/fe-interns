import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface PermissionRouteProps {
  children: React.ReactNode;
  permissions?: string[];
  roles?: string[];
}

export function PermissionRoute({ children, permissions = [], roles = [] }: PermissionRouteProps) {
  const { hasPermission, hasRole } = useAuth();

  // Check if user has any of the required permissions
  const hasRequiredPermission = permissions.length === 0 || permissions.some(p => hasPermission(p));

  // Check if user has any of the required roles
  const hasRequiredRole = roles.length === 0 || roles.some(r => hasRole(r));

  // Allow access if user has required permissions OR roles
  if (hasRequiredPermission || hasRequiredRole) {
    return <>{children}</>;
  }

  // Redirect to dashboard if not authorized
  return <Navigate to="/" replace />;
}
