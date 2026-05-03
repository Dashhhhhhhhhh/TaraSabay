import { useNavigate } from "react-router-dom";
import { useUser } from "../../../features/profile/UserContext";

function RideOfferList({ rideOffers, onViewRideOffer, onCancel }) {
  const navigate = useNavigate();
  const { user } = useUser(); // contains role and user_id

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
          {rideOffers.map((offer) => {
            const isOwner = offer.user_id === user?.user_id;

            return (
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

                    {user?.role === "Driver" && isOwner && (
                      <>
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
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default RideOfferList;
