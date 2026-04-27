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
    <main>
      <h1>Welcome back, {fullName}</h1>
      <p>
        TaraSabay makes commuting easier by connecting riders and drivers for
        shared journeys.
      </p>
      <p>You are now logged in to your dashboard.</p>

      <button onClick={handleRideOffers}>Ride Offers</button>
      <button onClick={handleRideRequest}>Ride Requests </button>
      <button onClick={handleMyRequestResponse}>My Request Response</button>
      <button onClick={handleMyOfferRequests}>My Offer Requests</button>
      <button onClick={handleMyRideRequest}>My Ride Requests</button>
      <button onClick={handleMyRideOffers}>My Ride Offers</button>
      <button onClick={handleProfile}>Profile </button>
      <button onClick={handleDriverProfile}>Driver Profile</button>
      <button onClick={handleMyMessages}>Messages</button>
      <button onClick={handleMyReportPage}>My Reports</button>
      <button onClick={handleLogout}>Log Out</button>
    </main>
  );
}

export default HomePage;
