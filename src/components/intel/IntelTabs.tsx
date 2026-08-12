// Sub-navigation shared by the Launch Intelligence screens. Keeps the four
// intel views grouped under one global "Insights" nav entry instead of
// cluttering the top bar with four items.

import { BarChart3, Search, TrendingUp } from "lucide-react";
import { NavLink } from "react-router-dom";

const TABS = [
  { label: "Overview", to: "/insights", end: true, icon: BarChart3 },
  { label: "Change feed", to: "/insights/feed", end: false, icon: TrendingUp },
  { label: "Projects", to: "/insights/projects", end: false, icon: Search },
] as const;

export function IntelTabs() {
  return (
    <nav className="mb-6 flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                isActive
                  ? "bg-[#e9e5dd] text-[#242424]"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`
            }
          >
            <Icon size={15} />
            {tab.label}
          </NavLink>
        );
      })}
    </nav>
  );
}
