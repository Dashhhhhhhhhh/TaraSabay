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
      console.log("My ride offers response:", response);
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
    <div className="my-ride-offer-pages">
      <h2>My Ride Offers</h2>
      {rideOffers.length === 0 ? (
        <p>No ride offers found.</p>
      ) : (
        <table className="my-ride-offers-table">
          <thead>
            <tr>
              <th>Pickup</th>
              <th>Dropoff</th>
              <th>Departure</th>
              <th>Vehicle</th>
              <th>Seats</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Created At</th>
              <th>Updated At</th>
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
                  <span className={`status-badge ${offer.status}`}>
                    {offer.status}
                  </span>
                </td>
                <td>{offer.notes || "-"}</td>
                <td>{new Date(offer.created_at).toLocaleString()}</td>
                <td>{new Date(offer.updated_at).toLocaleString()}</td>
                <td>
                  <button
                    onClick={() =>
                      navigate(
                        `/ride-offer/${offer.ride_offer_id}/offer-requests`,
                      )
                    }
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button
        onClick={() => navigate("/homepage")}
        aria-label="Back to Homepage"
      >
        Back to Homepage
      </button>
    </div>
  );
}

export default MyRideOffersPage;
