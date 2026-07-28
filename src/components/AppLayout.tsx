import { useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ShieldCheck,
  Target,
  LogOut,
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

const getNavLinkClasses = ({ isActive }: { isActive: boolean }) => {
  const base =
    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200";

  return isActive
    ? `${base} bg-slate-900 text-white shadow-md`
    : `${base} text-slate-600 hover:bg-slate-100 hover:text-slate-900`;
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
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="flex w-72 flex-col border-r border-slate-200 bg-white">
        {/* Logo */}
        <div className="border-b border-slate-200 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white">
              {tenant.logoText}
            </div>

            <div>
              <h1 className="text-lg font-bold">{tenant.displayName}</h1>
              <p className="text-sm text-slate-500">{tenant.shortName}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4">
          {modules.map((module) => {
            const Icon =
              iconMap[module.label as keyof typeof iconMap] ??
              LayoutDashboard;

            return (
              <NavLink
                key={module.path}
                to={module.path}
                end={module.path === "/"}
                className={getNavLinkClasses}
              >
                <Icon size={20} />
                <span>{module.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-6">
          <div>
            <h2 className="text-2xl font-bold">{tenant.displayName}</h2>
            <p className="text-sm text-slate-500">
              Customer Relationship Management
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 font-semibold text-white">
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-auto bg-slate-100 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}