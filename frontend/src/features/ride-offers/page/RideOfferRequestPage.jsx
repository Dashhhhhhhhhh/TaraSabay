import { useEffect, useState } from "react";
import { getOfferRequestsByOfferId } from "./../api/rideOffers.api";
import { useParams } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import "./../css/RideOfferRequestPage.css";

function RideOfferRequestPage() {
  const navigate = useNavigate();

  const { ride_offer_id } = useParams();
  const [offerRequests, setOfferRequests] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const handleBack = () => {
    navigate("/my-ride-offers");
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
                <td></td>
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
