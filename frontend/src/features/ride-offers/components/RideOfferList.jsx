import { useNavigate } from "react-router-dom";

function RideOfferList({ rideOffers, onViewRideOffer, onCancel }) {
  const navigate = useNavigate();

  return (
    <div className="table-wrapper">
      <table className="data-table">
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
              <td>
                <span className={`status-badge status-${offer.status}`}>
                  {offer.status}
                </span>
              </td>
              <td>
                <div className="table-actions">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => onViewRideOffer(offer)}
                  >
                    View
                  </button>
                  {offer.status === "open" && (
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => onCancel(offer.ride_offer_id)}
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() =>
                      navigate(`/ride-offer/${offer.ride_offer_id}/edit`)
                    }
                  >
                    Edit
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RideOfferList;
