import { useEffect, useState } from "react";
import {
  createRideOffer,
  getRideOfferById,
  getRideOffers,
  updateRideOffer,
  cancelRideOffer,
} from "../api/rideOffers.api";

function RideOfferPage() {
  const [rideOffers, setRideOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRideOffers = async () => {
      try {
        const response = await getRideOffers();
        setRideOffers(response.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRideOffers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!rideOffers || rideOffers.length === 0)
    return <p>No ride offers found.</p>;
  return (
    <main>
      <h1>Ride Offers</h1>
      <table>
        <thead>
          <tr>
            <th>Pickup Location</th>
            <th>Dropoff Location</th>
            <th>Departure Time</th>
            <th>Vehicle Type</th>
            <th>Seat Capacity</th>
            <th>Available Seats</th>
            <th>Status</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {rideOffers.map((offer) => (
            <tr key={offer.ride_offer_id}>
              <td>{offer.pickup_location}</td>
              <td>{offer.dropoff_location}</td>
              <td>{new Date(offer.departure_time).toLocaleString()}</td>
              <td>{offer.vehicle_type_snapshot}</td>
              <td>{offer.seat_capacity_snapshot}</td>
              <td>{offer.available_seats}</td>
              <td>{offer.status}</td>
              <td>{offer.notes || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default RideOfferPage;
