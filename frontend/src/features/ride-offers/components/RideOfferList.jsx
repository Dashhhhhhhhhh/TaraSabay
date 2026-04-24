import { useNavigate } from "react-router-dom";

function RideOfferList({ rideOffers, onViewRideOffer, onCancel }) {
  const navigate = useNavigate();

  return (
    <table>
      <thead>
        <tr>
          <th>Pickup Location</th>
          <th>Dropoff Location</th>
          <th>Departure Time</th>
          <th>Available Seats</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {rideOffers.map((offer) => (
          <tr key={offer.ride_offer_id}>
            <td>{offer.pickup_location}</td>
            <td>{offer.dropoff_location}</td>
            <td>{new Date(offer.departure_time).toLocaleString()}</td>
            <td>{offer.available_seats}</td>
            <td>{offer.status}</td>
            <td>
              <button onClick={() => onViewRideOffer(offer)}>View</button>
              {offer.status === "open" && (
                <button onClick={() => onCancel(offer.ride_offer_id)}>
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={() =>
                  navigate(`/ride-offer/${offer.ride_offer_id}/edit`)
                }
              >
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default RideOfferList;
