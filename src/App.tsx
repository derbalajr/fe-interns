
import { Route, Routes } from "react-router-dom";

import { AppLayout } from "@/components/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PublicOnlyRoute } from "@/components/PublicOnlyRoute";
import { TenantRoute } from "@/components/TenantRoute";

import { CustomersPage } from "@/pages/CustomersPage";
import { DashboardPage } from "@/pages/DashboardPage";
import DealsPage from "@/pages/DealsPage";
import { IntelProjectDetailPage } from "@/pages/IntelProjectDetailPage";
import { IntelProjectsPage } from "@/pages/IntelProjectsPage";
import { LaunchFeedPage } from "@/pages/LaunchFeedPage";
import { LaunchIntelligencePage } from "@/pages/LaunchIntelligencePage";
import { LeadDetailsPage } from "@/pages/LeadDetailsPage";
import LeadsPage from "@/pages/LeadsPage";
import { LoginPage } from "@/pages/LoginPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ProjectsPage } from "@/pages/ProjectsPage";
import { ProjectDetailsPage } from "@/pages/ProjectDetailsPage";
import { UnitsPage } from "@/pages/UnitsPage";
import { UnitDetailPage } from "@/pages/UnitDetailPage";
import { ReservationsPage } from "@/pages/ReservationsPage";
import UsersPage from "@/pages/UsersPage";
import RolesPage from "@/pages/RolesPage";

function App() {
  return (
    <Routes>
      {/* Logged-out-only routes */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Authenticated routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />

          {/* TAI */}
          <Route
            path="leads"
            element={
              <TenantRoute allowedTenant="tai">
                <LeadsPage />
              </TenantRoute>
            }
          />

          <Route
            path="leads/:id"
            element={
              <TenantRoute allowedTenant="tai">
                <LeadDetailsPage />
              </TenantRoute>
            }
          />

          <Route
            path="deals"
            element={
              <TenantRoute allowedTenant="tai">
                <DealsPage />
              </TenantRoute>
            }
          />

          <Route path="customers" element={<CustomersPage />} />

          {/* MARQ */}
          <Route
            path="insights"
            element={
              <TenantRoute allowedTenant="marq">
                <LaunchIntelligencePage />
              </TenantRoute>
            }
          />

          <Route
            path="insights/feed"
            element={
              <TenantRoute allowedTenant="marq">
                <LaunchFeedPage />
              </TenantRoute>
            }
          />

          <Route
            path="insights/projects"
            element={
              <TenantRoute allowedTenant="marq">
                <IntelProjectsPage />
              </TenantRoute>
            }
          />

          <Route
            path="insights/projects/:projectId"
            element={
              <TenantRoute allowedTenant="marq">
                <IntelProjectDetailPage />
              </TenantRoute>
            }
          />

          <Route
            path="reservations"
            element={
              <TenantRoute allowedTenant="marq">
                <ReservationsPage />
              </TenantRoute>
            }
          />

          {/* Projects list + project details (MARQ, gated by view-projects). */}
          <Route element={<ProtectedRoute permission="view-projects" />}>
            <Route
              path="projects"
              element={
                <TenantRoute allowedTenant="marq">
                  <ProjectsPage />
                </TenantRoute>
              }
            />

            <Route
              path="projects/:projectId"
              element={
                <TenantRoute allowedTenant="marq">
                  <ProjectDetailsPage />
                </TenantRoute>
              }
            />
          </Route>

          {/* Units: global list + unit detail (MARQ, gated by view-units). */}
          <Route element={<ProtectedRoute permission="view-units" />}>
            <Route
              path="units"
              element={
                <TenantRoute allowedTenant="marq">
                  <UnitsPage />
                </TenantRoute>
              }
            />

            <Route
              path="units/:unitId"
              element={
                <TenantRoute allowedTenant="marq">
                  <UnitDetailPage />
                </TenantRoute>
              }
            />
          </Route>

          {/* Users permission */}
          <Route element={<ProtectedRoute permission="view-users" />}>
            <Route path="users" element={<UsersPage />} />
          </Route>

          {/* Roles permission */}
          <Route element={<ProtectedRoute permission="view-roles" />}>
            <Route path="roles" element={<RolesPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;

