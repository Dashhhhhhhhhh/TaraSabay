import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return (
      <main>
        <h1>Welcome</h1>
        <p>Please log in to continue.</p>
      </main>
    );
  }

  const fullName = `${user.first_name} ${user?.middle_initial ? user.middle_initial + "." : ""} ${user.last_name}`;

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleRideOffers = () => {
    navigate("/ride-offer");
  };

  const handleDriverProfile = () => {
    navigate("/driver");
  };

  const handleMyOfferRequests = () => {
    navigate("/my-offer-requests");
  };

  const handleMyRequestResponse = () => {
    navigate("/my-request-response");
  };

  const handleRideRequest = () => {
    navigate("/ride-request");
  };

  const handleMyRideRequest = () => {
    navigate("/my-ride-request");
  };

  const handleMyRideOffers = () => {
    navigate("/my-ride-offers");
  };

  const handleMyMessages = () => {
    navigate("/my-messages");
  };

  const handleMyReportPage = () => {
    navigate("/my-report-page");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <main className="page dashboard-page">
      <div className="page-header">
        <div>
          <h1>Welcome back, {fullName}</h1>
          <p>
            TaraSabay makes commuting easier by connecting riders and drivers
            for shared journeys.
          </p>
        </div>

        <div className="page-actions">
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </div>
      <p>You are now logged in to your dashboard.</p>
      <div className="dashboard-grid">
        <section className="dashboard-card">
          <h2>Account</h2>
          <p>Manage your profile and driver information.</p>

          <div className="dashboard-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleProfile}
            >
              Profile
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleDriverProfile}
            >
              Driver Profile
            </button>
          </div>
        </section>

        <section className="dashboard-card">
          <h2>Ride Offers</h2>
          <p>Browse rides, manage your offers, and track seat requests.</p>

          <div className="dashboard-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleRideOffers}
            >
              Browse Ride Offers
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleMyRideOffers}
            >
              My Ride Offers
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleMyOfferRequests}
            >
              My Offer Requests
            </button>
          </div>
        </section>

        <section className="dashboard-card">
          <h2>Ride Requests</h2>
          <p>Create and manage passenger ride requests and driver responses.</p>

          <div className="dashboard-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleRideRequest}
            >
              Browse Ride Requests
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleMyRideRequest}
            >
              My Ride Requests
            </button>

            {user?.role === "Driver" && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleMyRequestResponse}
              >
                My Request Responses
              </button>
            )}
          </div>
        </section>

        <section className="dashboard-card">
          <h2>Communication & Safety</h2>
          <p>View messages and track reports related to rides.</p>

          <div className="dashboard-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleMyMessages}
            >
              Messages
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleMyReportPage}
            >
              My Reports
            </button>
          </div>
        </section>

        {user?.role === "Admin" && (
          <section className="dashboard-card dashboard-card-admin">
            <h2>Admin</h2>
            <p>Review and manage reports submitted by users.</p>

            <div className="dashboard-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate("/admin-reports")}
              >
                Admin Reports
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default HomePage;
