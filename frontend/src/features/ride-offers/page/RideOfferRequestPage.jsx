import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getOfferRequestsByOfferId } from "./../api/rideOffers.api";
import {
  acceptOfferRequest,
  rejectOfferRequest,
} from "../../offerRequests/api/offerRequests.api";

import { useNavigate } from "react-router-dom";
import "./../css/RideOfferRequestPage.css";

import CreateMessageModal from "../../messages/components/CreateMessageModal";

function RideOfferRequestPage() {
  const navigate = useNavigate();

  const { ride_offer_id } = useParams();
  const [offerRequests, setOfferRequests] = useState([]);
  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(true);

  const [, setAcceptLoading] = useState(false);
  const [, setRejectLoading] = useState(false);

  const [selectedOfferRequest, setSelectedOfferRequest] = useState(null);

  const fetchOfferRequests = async () => {
    try {
      const response = await getOfferRequestsByOfferId(ride_offer_id);

      setOfferRequests(response.offerRequests);
    } catch (err) {
      console.error("Failed to fetch offer requests:", err);
      setError("Failed to fetch offer requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!ride_offer_id) return;
    fetchOfferRequests();
  }, [ride_offer_id]);

  const handleAcceptOfferRequest = async (offerRequestId) => {
    setError(null);
    setAcceptLoading(true);

    try {
      await acceptOfferRequest(offerRequestId);
      await fetchOfferRequests();
    } catch (err) {
      console.error("Failed to accept offer requests:", err);
      setError("Failed to accept offer requests.");
    } finally {
      setAcceptLoading(false);
    }
  };

  const handleRejectOfferRequest = async (offerRequestId) => {
    setError(null);
    setRejectLoading(true);

    try {
      await rejectOfferRequest(offerRequestId);
      await fetchOfferRequests();
    } catch (err) {
      console.error("Failed to reject offer requests:", err);
      setError("Failed to reject offer requests.");
    } finally {
      setRejectLoading(false);
    }
  };

  const handleMessagePassenger = (offerRequest) => {
    setSelectedOfferRequest(offerRequest);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <main className="page">
      <div className="ride-offer-request-page">
        <div className="page-header">
          <div>
            <h1>Ride Offer Requests</h1>
            <p>Review passenger requests for this ride offer.</p>
          </div>

          <div className="page-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/my-ride-offers")}
            >
              Back
            </button>
          </div>
        </div>

        {offerRequests.length === 0 ? (
          <p>No ride offer requests found.</p>
        ) : (
          <div className="table-wrapper">
            <table className="data-table ride-offer-requests-table">
              <thead>
                <tr>
                  <th>Passenger</th>
                  <th>Seats</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {offerRequests.map((req) => (
                  <tr key={req.offer_request_id}>
                    <td>{req.passenger_user_id}</td>
                    <td>{req.requested_seats}</td>
                    <td>{req.message || "-"}</td>
                    <td>
                      <span className={`status-badge status-${req.status}`}>
                        {req.status}
                      </span>
                    </td>
                    <td>{new Date(req.created_at).toLocaleString()}</td>
                    <td>{new Date(req.updated_at).toLocaleString()}</td>
                    <td>
                      <div className="table-actions">
                        {req.status === "pending" ? (
                          <>Accept button Reject button</>
                        ) : req.status === "accepted" ? (
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => handleMessagePassenger(req)}
                          >
                            Message
                          </button>
                        ) : (
                          <span className="muted-text">No actions</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedOfferRequest && (
          <CreateMessageModal
            onClose={() => setSelectedOfferRequest(null)}
            receiver_user_id={selectedOfferRequest.passenger_user_id}
            ride_offer_id={ride_offer_id}
            onSuccess={async () => {
              setSelectedOfferRequest(null);
            }}
          />
        )}
      </div>
    </main>
  );
}

export default RideOfferRequestPage;
