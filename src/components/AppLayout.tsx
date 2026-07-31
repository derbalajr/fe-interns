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

import { APP_MODULES } from "../constants/modules";
import { useAuth } from "../context/AuthContext";
import { getCurrentTenant } from "../lib/tenant";
import { useCan } from "../hooks/use-can";
import { useTenant } from "@/hooks/use-tenant";
import { ChatDrawer } from "@/components/chatbot/ChatDrawer";
import { OnboardingChat } from "@/components/onboarding/OnboardingChat";

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
      <div className="flex min-h-screen items-center justify-center bg-white text-sm font-medium text-[#666666]">
        Loading your workspace...
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-sm font-medium text-[#666666]">
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
      <div className="min-h-screen bg-white text-[#252525]">
        <header className="fixed inset-x-0 top-0 z-50 h-[72px] bg-white px-3 pt-3 sm:px-5">
          <div className="mx-auto flex h-[56px] max-w-[1320px] items-center rounded-2xl bg-[#f8f8f8] px-3 sm:px-5">
            <div className="flex shrink-0 items-center gap-2 xl:min-w-[250px] xl:gap-4">
              <div className="hidden h-10 w-24 items-center justify-center sm:flex">
                <div className="text-center">
                  <p className="text-[10px] font-semibold tracking-[0.15em] text-[#9a927f]">
                    KEYSTONE
                  </p>

                  <p className="text-[7px] tracking-[0.12em] text-[#b2aa98]">
                    REAL ESTATE
                  </p>
                </div>
              </div>

              <div className="flex h-9 items-center gap-2 rounded-xl border border-[#e8e8e8] bg-white px-3 text-xs font-medium text-[#333333] shadow-[0_2px_8px_rgba(0,0,0,0.04)] sm:px-4">
                <span>{tenant.logoText} - CRM</span>

                <span
                  aria-hidden="true"
                  className="text-[#777777]"
                >
                  ⇄
                </span>
              </div>
            </div>

            <nav className="flex min-w-0 flex-1 justify-center overflow-x-auto px-2">
              <div className="flex items-center gap-1 rounded-xl border border-[#ededed] bg-white p-1 shadow-[0_2px_8px_rgba(0,0,0,0.035)]">
                {modules.map((module) => {
                  const Icon =
                    iconMap[module.label as keyof typeof iconMap] ??
                    LayoutDashboard;

                  return (
                    <NavLink
                      key={module.path}
                      to={module.path}
                      end={module.path === "/"}
                      className={({ isActive }) =>
                        `flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-3 text-[11px] font-medium transition ${
                          isActive
                            ? "bg-[#e9e5dd] text-[#242424]"
                            : "text-[#777777] hover:bg-[#f4f4f4] hover:text-[#333333]"
                        }`
                      }
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">
                        {module.label}
                      </span>
                    </NavLink>
                  );
                })}
              </div>
            </nav>

            <div className="flex shrink-0 items-center justify-end gap-2 xl:min-w-[250px]">
              <button
                type="button"
                aria-label="Search"
                className="hidden h-9 w-9 items-center justify-center rounded-xl border border-[#ededed] bg-white text-[#777777] shadow-[0_2px_8px_rgba(0,0,0,0.035)] transition hover:text-[#222222] md:flex"
              >
                <Search className="h-4 w-4" />
              </button>

              <button
                type="button"
                aria-label="Notifications"
                className="hidden h-9 w-9 items-center justify-center rounded-xl border border-[#ededed] bg-white text-[#777777] shadow-[0_2px_8px_rgba(0,0,0,0.035)] transition hover:text-[#222222] md:flex"
              >
                <Bell className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsChatOpen(true)}
                className="hidden h-9 min-w-[155px] items-center gap-2 rounded-xl bg-[#efede8] px-4 text-xs font-medium text-[#77736b] transition hover:bg-[#e6e2d8] hover:text-[#333333] xl:flex"
              >
                <MessageSquareText className="h-4 w-4" />
                <span>Ask Keystone...</span>
              </button>

              <div
                title={user?.name ?? "User"}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ececec] text-xs font-semibold text-[#555555] shadow-[0_2px_8px_rgba(0,0,0,0.035)] xl:hidden"
              >
                {user?.name?.charAt(0).toUpperCase() ?? "U"}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                aria-label="Logout"
                title="Logout"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#ededed] bg-white text-[#777777] shadow-[0_2px_8px_rgba(0,0,0,0.035)] transition hover:bg-red-50 hover:text-red-600 xl:hidden"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <aside className="fixed left-[calc(50%-660px)] top-[102px] z-40 hidden w-11 flex-col items-center gap-3 xl:flex">
          <button
            type="button"
            aria-label="Applications"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f4f4f4] text-[#666666] shadow-[0_2px_8px_rgba(0,0,0,0.035)]"
          >
            <Grid2X2 className="h-4 w-4" />
          </button>

          <button
            type="button"
            aria-label="Theme"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f4f4f4] text-[#666666] shadow-[0_2px_8px_rgba(0,0,0,0.035)]"
          >
            <Moon className="h-4 w-4" />
          </button>

          <button
            type="button"
            aria-label="Help"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f4f4f4] text-[#666666] shadow-[0_2px_8px_rgba(0,0,0,0.035)]"
          >
            <HelpCircle className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={handleLogout}
            aria-label="Logout"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f4f4f4] text-[#666666] shadow-[0_2px_8px_rgba(0,0,0,0.035)] transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
          </button>

          <div
            title={user?.name ?? "User"}
            className="mt-1 flex h-9 w-9 items-center justify-center rounded-xl bg-[#f4f4f4] text-xs font-semibold text-[#555555] shadow-[0_2px_8px_rgba(0,0,0,0.035)]"
          >
            {user?.name?.charAt(0).toUpperCase() ?? "U"}
          </div>
        </aside>

        <main className="min-h-screen pt-[112px]">
          <div className="px-4 pb-12 sm:px-6 xl:px-[170px]">
            <Outlet />
          </div>
        </main>
      </div>

      <ChatDrawer
        open={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      <OnboardingChat />
    </>
  );
}