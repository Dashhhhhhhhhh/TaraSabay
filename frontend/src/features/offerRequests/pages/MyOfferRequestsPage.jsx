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
    <main className="page">
      <div className="page-header">
        <div>
          <h1>My Offer Requests</h1>
          <p>Track ride offers you requested to join.</p>
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
      {offers.length === 0 ? (
        <p>No offer requests found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="data-table my-offer-requests-table">
            <thead>
              <tr>
                <th>Ride Offer ID</th>
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
                  <td>{offer.ride_offer_id}</td>
                  <td>{offer.requested_seats}</td>
                  <td>{offer.message || "-"}</td>
                  <td>
                    <span
                      className={`status-badge status-${offer.offer_request_status}`}
                    >
                      {offer.offer_request_status}
                    </span>
                  </td>
                  <td>{new Date(offer.created_at).toLocaleString()}</td>
                  <td>{new Date(offer.updated_at).toLocaleString()}</td>
                  <td>
                    <div className="table-actions">
                      {offer.offer_request_status === "pending" ? (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancelOfferRequest(offer)}
                        >
                          Cancel Request
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
    </main>
  );
}

export default MyOfferRequestPage;
