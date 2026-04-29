import { useEffect, useState } from "react";
import { getAllRideRequests } from "../api/rideRequests.api";
import CreateRequestResponseModal from "../../request-responses/components/CreateRequestResponseModal";
import RideRequestList from "../components/RideRequestList";

import { useNavigate } from "react-router-dom";

import "./../css/RideRequestsPage.css";

function RideRequestsPage() {
  const navigate = useNavigate();

  const [rideRequests, setRideRequests] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRideRequest, setSelectedRideRequest] = useState(null);

  const fetchAllRideRequests = async () => {
    try {
      const response = await getAllRideRequests();
      setRideRequests(response.data);
    } catch (err) {
      console.error("Failed to fetch ride requests:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRideRequests();
  }, []);

  const handleHomepage = () => {
    navigate("/homepage");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <main className="page">
      <div className="ride-requests-page">
        <div className="page-header">
          <div>
            <h1>Ride Requests</h1>
            <p>Browse passenger ride requests and respond as a driver.</p>
          </div>

          <div className="page-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleHomepage}
            >
              Homepage
            </button>
          </div>
        </div>

        <RideRequestList
          rideRequests={rideRequests}
          onViewRideRequest={setSelectedRideRequest}
        />
        {selectedRideRequest && selectedRideRequest.status !== "cancelled" && (
          <CreateRequestResponseModal
            request={selectedRideRequest}
            onClose={() => setSelectedRideRequest(null)}
          />
        )}
      </div>
    </main>
  );
}

export default RideRequestsPage;
