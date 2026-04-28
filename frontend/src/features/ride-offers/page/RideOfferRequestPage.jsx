import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getOfferRequestsByOfferId } from "./../api/rideOffers.api";
import {
  acceptOfferRequest,
  rejectOfferRequest,
} from "../../offerRequests/api/offerRequests.api";

import { useNavigate } from "react-router-dom";
import "./../css/RideOfferRequestPage.css";

function RideOfferRequestPage() {
  const navigate = useNavigate();

  const { ride_offer_id } = useParams();
  const [offerRequests, setOfferRequests] = useState([]);
  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(true);

  const [, setAcceptLoading] = useState(false);
  const [, setRejectLoading] = useState(false);

  const fetchOfferRequests = async () => {
    try {
      const response = await getOfferRequestsByOfferId(ride_offer_id);

      console.log("API response:", response.offerRequests);
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="ride-offer-request-page">
      <h2>Ride Offer Requests</h2>
      {offerRequests.length === 0 ? (
        <p>No ride offer requests found.</p>
      ) : (
        <table className="ride-offer-requests-table">
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
                  <span className={`status-badge ${req.status}`}>
                    {req.status}
                  </span>
                </td>
                <td>{new Date(req.created_at).toLocaleString()}</td>
                <td>{new Date(req.updated_at).toLocaleString()}</td>
                <td>
                  {req.status === "pending" ? (
                    <>
                      <button
                        className="btn-accept"
                        onClick={() =>
                          handleAcceptOfferRequest(req.offer_request_id)
                        }
                      >
                        Accept
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() =>
                          handleRejectOfferRequest(req.offer_request_id)
                        }
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className={`status-badge ${req.status}`}>
                      {req.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={() => navigate("/my-ride-offers")}>Back</button>
    </div>
  );
}

export default RideOfferRequestPage;
