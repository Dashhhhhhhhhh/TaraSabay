import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RideRequestForm from "../components/RideRequestForm";

import RideRequestResponseModal from "../../request-responses/components/RideRequestResponseModal";

import {
  getMyRideRequest,
  cancelRideRequest,
  createRideRequest,
} from "./../api/rideRequests.api";

import "./../css/MyRideRequestPage.css";

function MyRideRequestPage() {
  const navigate = useNavigate();

  const [ride, setRide] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [selectedRide, setSelectedRide] = useState(null);

  const fetchMyRideRequest = async () => {
    try {
      const response = await getMyRideRequest();
      setRide(response.data);
    } catch (err) {
      console.error("Failed to fetch ride requests:", err);
      setError(err.response?.data?.message || "Failed to fetch ride requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRideRequest();
  }, []);

  const handleCancelRideRequest = async (ride) => {
    try {
      await cancelRideRequest(ride.ride_request_id);
      await fetchMyRideRequest();
    } catch (err) {
      console.error("Failed to cancel ride request:", err);
      setError(err.response?.data?.message || "Failed to cancel ride request");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRideRequest = async (payload) => {
    setLoading(true);
    setError(null);

    try {
      await createRideRequest(payload);
      await fetchMyRideRequest();
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create ride request");
    } finally {
      setLoading(false);
    }
  };

  const handleViewResponses = (ride) => {
    setSelectedRide(ride);
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <h1>My Ride Requests ({ride.length})</h1>
          <p>Create, track, and manage your submitted ride requests.</p>
        </div>

        <div className="page-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            Create Ride Request
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/homepage")}
          >
            Back to Homepage
          </button>
        </div>
      </div>

      {ride.length === 0 ? (
        <p>No ride requests found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="data-table my-ride-request-table">
            <thead>
              <tr>
                <th>Pickup</th>
                <th>Dropoff</th>
                <th>Departure</th>
                <th>Requested Seats</th>
                <th>Notes</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ride.map((req) => (
                <tr key={req.ride_request_id}>
                  <td>{req.pickup_location}</td>
                  <td>{req.dropoff_location}</td>
                  <td>{new Date(req.departure_time).toLocaleString()}</td>
                  <td>{req.requested_seats}</td>
                  <td>{req.notes || "-"}</td>
                  <td>
                    <span className={`status-badge status-${req.status}`}>
                      {req.status}
                    </span>
                  </td>
                  <td>{new Date(req.created_at).toLocaleString()}</td>
                  <td>{new Date(req.updated_at).toLocaleString()}</td>
                  <td>
                    <div className="table-actions">
                      {req.status === "open" && (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancelRideRequest(req)}
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => handleViewResponses(req)}
                      >
                        Responses
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <RideRequestForm
          onSubmit={handleCreateRideRequest}
          onCancel={handleCancelForm}
          loading={loading}
        />
      )}

      {selectedRide && (
        <RideRequestResponseModal
          rideRequest={selectedRide}
          onClose={() => setSelectedRide(null)}
        />
      )}
    </main>
  );
}

export default MyRideRequestPage;
