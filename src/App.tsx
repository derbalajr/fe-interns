import {
  Route,
  Routes,
} from "react-router-dom";
import { UiKitPage } from "@/pages/UiKitPage";
import { AppLayout } from "@/components/AppLayout";import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicOnlyRoute } from "./components/PublicOnlyRoute";
import { CustomersPage } from "./pages/CustomersPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ReservationsPage } from "./pages/ReservationsPage";

function App() {
  return (
    <Routes>
      {/* Logged-out-only routes */}
      <Route element={<PublicOnlyRoute />}>
        <Route
          path="/login"
          element={<LoginPage />}
        />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
        
          <Route
            index
            element={<DashboardPage />}
          />

          <Route
            path="customers"
            element={<CustomersPage />}
          />

          <Route
            path="reservations"
            element={<ReservationsPage />}
          />
          <Route
      path="ui-kit"
      element={<UiKitPage />}
    />
        </Route>
      </Route>

      <Route
        path="*"
        element={<NotFoundPage />}
      />
    </Routes>
  );
}

export default App;