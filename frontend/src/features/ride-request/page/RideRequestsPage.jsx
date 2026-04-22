import { useEffect, useState } from "react";
import { getAllRideRequests } from "../api/rideRequests.api";

import CreateRequestResponseModal from "../../request-responses/components/CreateRequestResponseModal";

import "./../css/RideRequestsPage.css";

function RideRequestsPage() {
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="ride-requests-page">
      <h2>Ride Requests</h2>
      {rideRequests.length === 0 ? (
        <p>No ride requests found.</p>
      ) : (
        <table className="ride-requests-table">
          <thead>
            <tr>
              <th>Pickup</th>
              <th>Dropoff</th>
              <th>Departure</th>
              <th>Requested Seats</th>
              <th>Notes</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rideRequests.map((req) => (
              <tr key={req.ride_request_id}>
                <td>{req.pickup_location}</td>
                <td>{req.dropoff_location}</td>
                <td>{new Date(req.departure_time).toLocaleString()}</td>
                <td>{req.requested_seats}</td>
                <td>{req.notes || "-"}</td>
                <td>{req.status}</td>
                <td>
                  {["open"].includes(req.status) && (
                    <button
                      type="button"
                      onClick={() => setSelectedRideRequest(req)}
                    >
                      Respond
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedRideRequest && selectedRideRequest.status !== "cancelled" && (
        <CreateRequestResponseModal
          request={selectedRideRequest}
          onClose={() => setSelectedRideRequest(null)}
        />
      )}
    </div>
  );
}

export default RideRequestsPage;
