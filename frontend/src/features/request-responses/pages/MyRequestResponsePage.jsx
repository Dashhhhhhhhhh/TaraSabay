import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getMyRequestResponses,
  cancelRequestResponse,
} from "../api/requestResponses.api";

import "./MyRequestResponsePage.css";

import CreateMessageModal from "../../messages/components/CreateMessageModal";
function MyRequestResponsePage() {
  const navigate = useNavigate();

  const [responses, setResponses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [cancelLoading, setCancelLoading] = useState(false);

  const [selectedResponseForMessage, setSelectedResponseForMessage] =
    useState(null);

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

  const handleMessagePassenger = (response) => {
    setSelectedResponseForMessage(response);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <h1>My Request Responses</h1>
          <p>Track responses you sent to passenger ride requests.</p>
        </div>

        <div className="page-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/homepage")}
          >
            Back to Homepage
          </button>
        </div>
      </div>
      {responses.length === 0 ? (
        <p>No request response found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
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
                          type="button"
                          className="btn btn-danger btn-sm"
                          disabled={cancelLoading}
                          onClick={() =>
                            handleRCancelRequestResponse(
                              resp.request_response_id,
                            )
                          }
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          console.log("Selected response for message:", resp);
                          setSelectedResponseForMessage(resp);
                        }}
                      >
                        Message
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedResponseForMessage && (
        <CreateMessageModal
          onClose={() => setSelectedResponseForMessage(null)}
          receiver_user_id={selectedResponseForMessage.receiver_user_id}
          ride_request_id={selectedResponseForMessage.ride_request_id}
          onSuccess={async () => {
            setSelectedResponseForMessage(null);
          }}
        />
      )}
    </main>
  );
}

export default MyRequestResponsePage;
