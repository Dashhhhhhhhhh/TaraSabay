import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getMyRequestResponses,
  cancelRequestResponse,
} from "../api/requestResponses.api";

import "./MyRequestResponsePage.css";

function MyRequestResponsePage() {
  const navigate = useNavigate();

  const [responses, setResponses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [, setCancelLoading] = useState(false);

  const fetchMyRequestResponses = async () => {
    try {
      const response = await getMyRequestResponses();
      setResponses(response.data);
    } catch (err) {
      console.error("Failed to fetch request response:", err);
      setError(
        err.response?.data?.message || "Failed to fetch request responses",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRequestResponses();
  }, []);

  const handleRCancelRequestResponse = async (request_response_id) => {
    setError(null);
    setCancelLoading(true);

    try {
      await cancelRequestResponse(request_response_id);
      await fetchMyRequestResponses();
    } catch (err) {
      console.error("Failed to cancel request response:", err);
      setError("Failed to cancel request response.");
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="my-request-response-page">
      <h2>My Request Responses</h2>
      {responses.length === 0 ? (
        <p>No request response found.</p>
      ) : (
        <table className="my-request-response-table">
          <thead>
            <tr>
              <th>Message</th>
              <th>Status</th>
              <th>Pickup</th>
              <th>Dropoff</th>
              <th>Departure</th>
              <th>Requested Seats</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {responses.map((resp) => (
              <tr key={resp.request_response_id}>
                <td>{resp.message}</td>
                <td>{resp.status}</td>
                <td>{resp.pickup_location || "N/A"}</td>
                <td>{resp.dropoff_location || "N/A"}</td>
                <td>
                  {resp.departure_time
                    ? new Date(resp.departure_time).toLocaleString()
                    : "-"}
                </td>
                <td>{resp.requested_seats}</td>
                <td>
                  {resp.status === "pending" ? (
                    <>
                      <button
                        className="btn-cancel"
                        onClick={() =>
                          handleRCancelRequestResponse(resp.request_response_id)
                        }
                      >
                        Cancel
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

      <button onClick={() => navigate("/homepage")}>Back to Homepage</button>
    </div>
  );
}

export default MyRequestResponsePage;
