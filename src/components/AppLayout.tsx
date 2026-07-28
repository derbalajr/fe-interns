import { useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ShieldCheck,
  Target,
  Building2,
  BriefcaseBusiness,
} from "lucide-react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";

import { APP_MODULES } from "../constants/modules";
import { useAuth } from "../context/AuthContext";
import { useTenant } from "../hooks/use-tenant";

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
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm font-medium text-slate-600">
        Loading your workspace...
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm font-medium text-slate-600">
        No valid workspace assigned. Redirecting...
      </div>
    );
  }

  const modules = APP_MODULES.filter((module) => {
    if (!module.tenants) {
      return true;
    }

    return module.tenants.includes(tenant.id);
  });

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Top Navigation */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white">
        <div className="flex h-16 items-center px-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 font-bold text-white">
              {tenant.logoText}
            </div>

            <div>
              <h1 className="text-sm font-bold text-slate-900">
                {tenant.displayName}
              </h1>
              <p className="text-xs text-slate-500">
                {tenant.shortName}
              </p>
            </div>
          </div>

          {/* Center Navigation */}
          <div className="flex flex-1 justify-center">
            <nav className="flex items-center gap-2">
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
                      `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                        isActive
                          ? "bg-slate-900 text-white"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`
                    }
                  >
                    <Icon size={18} />
                    <span>{module.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 font-semibold text-white">
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="pt-16">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}