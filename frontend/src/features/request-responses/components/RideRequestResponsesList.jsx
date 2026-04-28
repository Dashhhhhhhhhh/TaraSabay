import { useEffect, useState } from "react";
import { getRequestResponsesByRideRequestId } from "../api/requestResponses.api";

import {
  acceptRequestResponse,
  rejectRequestResponse,
} from "../api/requestResponses.api";

import "./../css/RideRequestResponsesList.css";

function RideRequestResponsesList({ rideRequestId }) {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [, setAcceptLoadingId] = useState(false);
  const [, setrejectLoadingId] = useState(false);

  const fetchResponses = async () => {
    try {
      const res = await getRequestResponsesByRideRequestId(rideRequestId);
      setResponses(res.data);
    } catch (err) {
      console.error("Failed to fetch responses:", err);
      setError(err.response?.data?.message || "Failed to fetch responses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!rideRequestId) return;
    fetchResponses();
  }, [rideRequestId]);

  const handleAcceptRequestResponse = async (request_response_id) => {
    setError(null);
    setAcceptLoadingId(true);

    try {
      await acceptRequestResponse(request_response_id);
      await fetchResponses();
    } catch (err) {
      console.error("Failed to accept request response:", err);
      setError("Failed to accept request response.");
    } finally {
      setAcceptLoadingId(false);
    }
  };

  const handleRejectRequestResponse = async (request_response_id) => {
    setError(null);
    setrejectLoadingId(true);

    try {
      await rejectRequestResponse(request_response_id);
      await fetchResponses();
    } catch (err) {
      console.error("Failed to reject request response:", err);
      setError("Failed to reject request response.");
    } finally {
      setrejectLoadingId(false);
    }
  };

  if (loading) return <p>Loading request responses...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (responses.length === 0)
    return <p>No request responses found for this ride request.</p>;

  return (
    <div className="responses-wrapper">
      {loading && (
        <p className="responses-state">Loading request responses...</p>
      )}
      {error && <p className="responses-state error">{error}</p>}
      {!loading && !error && responses.length === 0 && (
        <p className="responses-state empty">
          No request responses found for this ride request.
        </p>
      )}
      {!loading && !error && responses.length > 0 && (
        <table className="responses-table">
          <thead>
            <tr>
              <th>Message</th>
              <th>Status</th>
              <th>Pickup</th>
              <th>Dropoff</th>
              <th>Departure</th>
              <th>Seats</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {responses.map((resp) => (
              <tr key={resp.request_response_id}>
                <td className="response-message">{resp.message}</td>
                <td>
                  <span className={`status-badge ${resp.status.toLowerCase()}`}>
                    {resp.status}
                  </span>
                </td>
                <td>{resp.pickup_location || "N/A"}</td>
                <td>{resp.dropoff_location || "N/A"}</td>
                <td>
                  {resp.departure_time
                    ? new Date(resp.departure_time).toLocaleString()
                    : "-"}
                </td>
                <td>{resp.requested_seats}</td>
                <td>{resp.driver_full_name}</td>
                <td>
                  {resp.status === "pending" ? (
                    <>
                      <button
                        className="btn-accept"
                        onClick={() =>
                          handleAcceptRequestResponse(resp.request_response_id)
                        }
                      >
                        Accept
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() =>
                          handleRejectRequestResponse(resp.request_response_id)
                        }
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className={`status-badge ${resp.status}`}>
                      {resp.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RideRequestResponsesList;
