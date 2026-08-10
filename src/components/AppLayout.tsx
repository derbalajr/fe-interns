import { useEffect, useState } from "react";
import {
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Grid2X2,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  Moon,
  Search,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { ChatDrawer } from "@/components/chatbot/ChatDrawer";
import { OnboardingChat } from "@/components/onboarding/OnboardingChat";
import { APP_MODULES } from "@/constants/modules";
import { useAuth } from "@/context/AuthContext";
import { useCan } from "@/hooks/use-can";
import { useTenant } from "@/hooks/use-tenant";

const iconMap = {
  Dashboard: LayoutDashboard,
  Leads: Target,
  Deals: BriefcaseBusiness,
  Customers: Users,
  Reservations: CalendarDays,
  Projects: Building2,
  Users: ShieldCheck,
};

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { can } = useCan();

  const [isChatOpen, setIsChatOpen] = useState(false);

  const { logout, user, isLoadingUser } = useAuth();
  const { tenant, isLoadingTenant } = useTenant();

  useEffect(() => {
    if (!isLoadingUser && !isLoadingTenant && user && !tenant) {
      if (location.pathname !== "/login") {
        navigate("/login", { replace: true });
      }
    }
  }, [
    isLoadingUser,
    isLoadingTenant,
    user,
    tenant,
    location.pathname,
    navigate,
  ]);

  if (isLoadingUser || isLoadingTenant) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading your workspace...
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        No valid workspace assigned. Redirecting...
      </div>
    );
  }

  const modules = APP_MODULES.filter((module) => {
    const tenantAllowed =
      !module.tenants || module.tenants.includes(tenant.id);

    const permissionAllowed =
      !module.permission || can(module.permission);

    return tenantAllowed && permissionAllowed;
  });

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* KEEP THE REST OF YOUR EXISTING JSX HERE */}
    </>
  );
}