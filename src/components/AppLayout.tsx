import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const getNavLinkClasses = ({
  isActive,
}: {
  isActive: boolean;
}) => {
  const base =
    "rounded-lg px-3 py-2 text-sm font-medium transition";

  return isActive
    ? `${base} bg-slate-900 text-white`
    : `${base} text-slate-600 hover:bg-slate-100`;
};

export function AppLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <NavLink
            to="/"
            className="font-serif text-xl font-semibold"
          >
            Keystone CRM
          </NavLink>

          <nav className="flex items-center gap-2">
            <NavLink
              to="/"
              end
              className={getNavLinkClasses}
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/customers"
              className={getNavLinkClasses}
            >
              Customers
            </NavLink>

            <button
              type="button"
              onClick={handleLogout}
              className="ml-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}