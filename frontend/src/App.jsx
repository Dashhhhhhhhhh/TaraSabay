import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";
import RegisterPage from "./features/auth/pages/RegisterPage";
import LoginPage from "./features/auth/pages/LoginPage";
import HomePage from "./pages/HomePage";
import { UserProvider } from "./features/profile/UserContext";
import ProfilePage from "./features/profile/pages/ProfilePage";
import RideOfferPage from "./features/ride-offers/pages/RideOffersPage";
import CreateRideOfferForm from "./features/ride-offers/components/CreateRideOfferForm";

function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/homepage"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ride-offer"
            element={
              <ProtectedRoute>
                <RideOfferPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ride-offer/create"
            element={
              <ProtectedRoute>
                <CreateRideOfferForm />
              </ProtectedRoute>
            }
          />
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
