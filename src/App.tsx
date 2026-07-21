import { Route, Routes } from "react-router-dom";
import { LeadDetailsPage } from "@/pages/LeadDetailsPage";
import { AppLayout } from "@/components/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PublicOnlyRoute } from "@/components/PublicOnlyRoute";
import { CustomersPage } from "@/pages/CustomersPage";
import { DashboardPage } from "@/pages/DashboardPage";
import LeadsPage from "@/pages/LeadsPage";
import { LoginPage } from "@/pages/LoginPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
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

          <Route path="leads" element={<LeadsPage />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="leads/:id" element={<LeadDetailsPage />} />
          <Route path="customers" element={<CustomersPage />} />

          <Route path="reservations" element={<ReservationsPage />} />

          <Route path="users" element={<UsersPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
