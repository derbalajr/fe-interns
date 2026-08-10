import { Route, Routes } from "react-router-dom";
import { LeadDetailsPage } from "@/pages/LeadDetailsPage";
import { AppLayout } from "@/components/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ManagerRoute } from "@/components/ManagerRoute";
import { PublicOnlyRoute } from "@/components/PublicOnlyRoute";
import { TenantRoute } from "@/components/TenantRoute";
import { CustomersPage } from "@/pages/CustomersPage";
import { DashboardPage } from "@/pages/DashboardPage";
import DealsPage from "@/pages/DealsPage";
import LeadsPage from "@/pages/LeadsPage";
import { LoginPage } from "@/pages/LoginPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ProjectsPage } from "@/pages/ProjectsPage";
import { ProjectUnitsPage } from "@/pages/ProjectUnitsPage";
import { UnitDetailPage } from "@/pages/UnitDetailPage";
import { ReservationsPage } from "@/pages/ReservationsPage";
import UsersPage from "@/pages/UsersPage";

function App() {
  return (
    <Routes>
      {/* Logged-out-only routes */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />

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

          <Route
            path="reservations"
            element={
              <TenantRoute allowedTenant="marq">
                <ReservationsPage />
              </TenantRoute>
            }
          />

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
                <ProjectUnitsPage />
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

          <Route element={<ManagerRoute />}>
            <Route path="users" element={<UsersPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;