import { useState, useEffect } from "react";
import { getMyRideOffers } from "../api/rideOffers.api";
import { useNavigate } from "react-router-dom";

import "./../css/MyRideOffersPage.css";

function MyRideOffersPage() {
  const navigate = useNavigate();
  const [rideOffers, setRideOffers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMyRideOffers = async () => {
    try {
      const response = await getMyRideOffers();
      setRideOffers(response.data || []);
    } catch (err) {
      console.error("Failed to fetch my ride offers:", err);
      setError("Failed to fetch ride offers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRideOffers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <h1>My Ride Offers</h1>
          <p>Manage ride offers you created and view passenger requests.</p>
        </div>

        <div className="page-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/homepage")}
            aria-label="Back to Homepage"
          >
            Back to Homepage
          </button>
        </div>
      </div>

      {rideOffers.length === 0 ? (
        <p>No ride offers found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="data-table my-ride-offers-table">
            <thead>
              <tr>
                <th>Pickup</th>
                <th>Dropoff</th>
                <th>Departure</th>
                <th>Vehicle</th>
                <th>Seats</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Created</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rideOffers.map((offer) => (
                <tr key={offer.ride_offer_id}>
                  <td>{offer.pickup_location}</td>
                  <td>{offer.dropoff_location}</td>
                  <td>
                    {new Date(offer.departure_time).toLocaleString("en-PH", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td>{offer.vehicle_type_snapshot}</td>
                  <td>
                    {offer.available_seats}/{offer.seat_capacity_snapshot}
                  </td>
                  <td>
                    <span className={`status-badge status-${offer.status}`}>
                      {offer.status}
                    </span>
                  </td>
                  <td>{offer.notes || "-"}</td>
                  <td>{new Date(offer.created_at).toLocaleString()}</td>
                  <td>{new Date(offer.updated_at).toLocaleString()}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() =>
                          navigate(
                            `/ride-offer/${offer.ride_offer_id}/offer-requests`,
                          )
                        }
                      >
                        View
                      </button>
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

export default MyRideOffersPage;
