import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Grid2X2,
  HelpCircle,
  LayoutDashboard,
  LineChart,
  LogOut,
  MessageSquareText,
  Moon,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

import { ChatDrawer } from "@/components/chatbot/ChatDrawer";
import { APP_MODULES } from "@/constants/modules";
import { useAuth } from "@/context/AuthContext";
import { useCan } from "@/hooks/use-can";
import { useTenant } from "@/hooks/use-tenant";

const iconMap = {
  Dashboard: LayoutDashboard,
  Insights: LineChart,
  Leads: Target,
  Deals: BriefcaseBusiness,
  Customers: Users,
  Reservations: CalendarDays,
  Projects: Building2,
  Units: Grid2X2,
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
    const tenantAllowed = !module.tenants || module.tenants.includes(tenant.id);

    const permissionAllowed = !module.permission || can(module.permission);

    return tenantAllowed && permissionAllowed;
  });

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  // The "Ask the market" assistant is powered by the Launch Intelligence API,
  // which only exists for MarQ. Gate every entry point the same way the rest of
  // the feature (routes, nav, dashboard) is gated so non-MarQ tenants don't get
  // a broken/irrelevant assistant.
  const isMarq = tenant.id === "marq";

  return (
    <>
      <div className="min-h-screen bg-white text-[#252525]">
        <header className="fixed inset-x-0 top-0 z-50 h-[72px] bg-white px-3 pt-3 sm:px-5">
          <div className="mx-auto flex h-[56px] max-w-[1320px] items-center gap-3 rounded-2xl bg-[#f8f8f8] px-3 sm:gap-4 sm:px-4">
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <div className="hidden flex-col leading-none sm:flex">
                <span className="text-[11px] font-semibold tracking-[0.18em] text-[#8f8873]">
                  KEYSTONE
                </span>

                <span className="text-[8px] tracking-[0.22em] text-[#b6ae9b]">
                  REAL ESTATE
                </span>
              </div>

              <button
                type="button"
                className="flex h-9 items-center gap-2 rounded-xl border border-[#e8e8e8] bg-white px-3 text-xs font-medium text-[#333333] shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition hover:border-[#dcdcdc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9d2c4] sm:px-4"
              >
                <span>{tenant.logoText} - CRM</span>

                <span aria-hidden="true" className="text-[#9a927f]">
                  ⇄
                </span>
              </button>
            </div>

            {/* Primary nav: hugs its items and stays centered when they fit;
                scrolls (no mid-label clipping) when the viewport is too narrow. */}
            <nav className="flex min-w-0 flex-1 justify-center">
              <div className="flex w-max max-w-full items-center gap-1 overflow-x-auto rounded-xl border border-[#ededed] bg-white p-1 shadow-[0_2px_8px_rgba(0,0,0,0.035)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
                        `flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9d2c4] ${
                          isActive
                            ? "bg-[#e9e5dd] text-[#242424]"
                            : "text-[#777777] hover:bg-[#f4f4f4] hover:text-[#333333]"
                        }`
                      }
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      <span className="hidden sm:inline">{module.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </nav>

            <div className="flex shrink-0 items-center justify-end gap-2">
              {isMarq && (
                <button
                  type="button"
                  onClick={() => setIsChatOpen(true)}
                  className="hidden h-9 items-center gap-2 rounded-xl bg-[#efede8] px-4 text-xs font-medium text-[#77736b] transition hover:bg-[#e6e2d8] hover:text-[#333333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9d2c4] xl:flex"
                >
                  <MessageSquareText className="h-4 w-4" />
                  <span>Ask the market</span>
                </button>
              )}

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
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#ededed] bg-white text-[#777777] shadow-[0_2px_8px_rgba(0,0,0,0.035)] transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9d2c4] xl:hidden"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <aside className="fixed left-[min(7rem,max(0.75rem,calc(50%-660px)))] top-[102px] z-40 hidden w-11 flex-col items-center gap-3 xl:flex">
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

      {isMarq && (
        <>
          <ChatDrawer open={isChatOpen} onClose={() => setIsChatOpen(false)} />

          {/* Floating button to open the site chatbot (replaces Onboarding Assistant) */}
          {!isChatOpen && (
            <button
              type="button"
              onClick={() => setIsChatOpen(true)}
              aria-label="Open assistant"
              className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg transition hover:bg-slate-700"
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </>
      )}
    </>
  );
}
