import type { ReactNode } from "react";
import { useCan } from "../hooks/use-can.ts";

type CanProps = {
  permission?: string;
  role?: string;
  children: ReactNode;
};

export function Can({
  permission,
  role,
  children,
}: CanProps) {
  const { can, hasRole } = useCan();

  if (permission && !can(permission)) {
    return null;
  }

  if (role && !hasRole(role)) {
    return null;
  }

  return <>{children}</>;
}