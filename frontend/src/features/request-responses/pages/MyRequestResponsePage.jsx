import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import {
  createRequestResponse,
  getMyRequestResponses,
} from "../api/requestResponses.api";

import CreateRequestResponseModal from "../components/CreateRequestResponseModal";

import "./MyRequestResponsePage.css";

function MyRequestResponsePage() {
  const navigate = useNavigate();

  const [responses, setResponses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedRequest, setSelectedRequest] = useState(false);
  const fetchMyRequestResponse = async () => {
    try {
      const response = await getMyRequestResponses();
      setResponses(response.data);
    } catch (err) {
      console.error("Failed to fetch request response:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRequestResponse();
  }, []);

  const handleCloseModal = () => {
    setSelectedRequest(null);
    navigate("/my-request-response");
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
            </tr>
          </thead>
          <tbody>
            {responses.map((resp) => (
              <tr
                key={resp.request_response_id}
                onClick={() => setSelectedRequest(resp)}
              >
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
                  <button onClick={() => setSelectedRequest(resp)}>
                    Respond
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {selectedRequest && (
        <CreateRequestResponseModal
          request={selectedRequest}
          onClose={handleCloseModal}
        />
      )}
      <button onClick={() => navigate("/homepage")}>Back to Homepage</button>
    </div>
  );
}

export default MyRequestResponsePage;
