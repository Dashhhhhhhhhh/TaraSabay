import { useEffect, useState } from "react";
import {
  getMyOfferRequests,
  cancelOfferRequest,
} from "./../api/offerRequests.api";

import { useNavigate } from "react-router-dom";

import "./MyOfferRequestsPage.css";

function MyOfferRequestPage() {
  const navigate = useNavigate();

  const [offers, setOffers] = useState([]);
  const [error] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMyOfferRequest = async () => {
    try {
      const response = await getMyOfferRequests();
      setOffers(response.data);
    } catch (err) {
      console.error("Failed to fetch offer requests:", err);

      if (err.response) {
        // Response was received and logged above.
      } else if (err.request) {
        console.error("No response received. Request details:", err.request);
      } else {
        console.error("Error message:", err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOfferRequest();
  }, []);

  const handleCancelOfferRequest = async (offer) => {
    try {
      await cancelOfferRequest(offer.offer_request_id);
      fetchMyOfferRequest();
    } catch (err) {
      console.error("Failed to cancel offer requests:", err);

      if (err.response) {
        // Response was received and logged above.
      } else if (err.request) {
        console.error("No response received. Request details:", err.request);
      } else {
        console.error("Error message:", err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <div className="my-offer-requests-page">
        <h2>My Offer Requests</h2>
        {offers.length === 0 ? (
          <p>No offer requests found.</p>
        ) : (
          <table className="my-offer-requests-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Ride Offer ID</th>
                <th>Passenger User ID</th>
                <th>Requested Seats</th>
                <th>Message</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => (
                <tr key={offer.offer_request_id}>
                  <td>{offer.offer_request_id}</td>
                  <td>{offer.ride_offer_id}</td>
                  <td>{offer.passenger_user_id}</td>
                  <td>{offer.requested_seats}</td>
                  <td>{offer.message || "-"}</td>
                  <td>{offer.offer_request_status}</td>
                  <td>{new Date(offer.created_at).toLocaleString()}</td>
                  <td>{new Date(offer.updated_at).toLocaleString()}</td>
                  <td>
                    {offer.offer_request_status === "pending" && (
                      <button onClick={() => handleCancelOfferRequest(offer)}>
                        Cancel Request
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button onClick={() => navigate("/homepage")}>Back to Homepage</button>
      </div>
    </div>
  );
}

export default MyOfferRequestPage;
