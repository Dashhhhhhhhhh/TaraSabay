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
import CreateRideOfferPage from "./features/ride-offers/pages/CreateRideOfferpage";
import EditRideOfferPage from "./features/ride-offers/pages/EditRideOfferPage";

import DriveProfilePage from "./features/driverProfile/pages/DriverProfilePage";

import MyOfferRequestsPage from "./features/offerRequests/pages/MyOfferRequestsPage";

import RideRequestsPage from "./features/ride-request/page/RideRequestsPage";

import MyRequestResponsePage from "./features/request-responses/pages/MyRequestResponsePage";

import CreateRideRequestPage from "./features/ride-request/page/CreateRideRequestPage";

import MyRideRequestPage from "./features/ride-request/page/MyRideRequestPage";

function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/homepage" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/ride-offer" element={<RideOfferPage />} />
            <Route
              path="/ride-offer/create"
              element={<CreateRideOfferPage />}
            />

            <Route
              path="/ride-offer/:ride_offer_id/edit"
              element={<EditRideOfferPage />}
            />
            <Route path="/driver" element={<DriveProfilePage />} />

            <Route
              path="/my-offer-requests"
              element={<MyOfferRequestsPage />}
            />

            <Route
              path="/my-request-response"
              element={<MyRequestResponsePage />}
            />

            <Route
              path="/ride-request/create"
              element={<CreateRideRequestPage />}
            />

            <Route path="/ride-request" element={<RideRequestsPage />} />

            <Route path="/my-ride-request" element={<MyRideRequestPage />} />
          </Route>
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
