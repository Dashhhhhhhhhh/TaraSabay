import "./../css/RideOfferDetailsModal.css";

function RideOfferDetailsModal({
  rideOffer,
  onClose,
  onCancel,
  currentUserId,
  currentUserRole,
  onRequestSeat,
}) {
  const isOwner = rideOffer.user_id === currentUserId;

  return (
    <div className="ride-offer-modal">
      <div
        className="ride-offer-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Ride Offer Details</h2>
          <span className={`status-badge status-${rideOffer.status}`}>
            {rideOffer.status}
          </span>
        </div>

        <div className="modal-details">
          <p>
            <strong>Pickup:</strong> {rideOffer.pickup_location}
          </p>
          <p>
            <strong>Dropoff:</strong> {rideOffer.dropoff_location}
          </p>
          <p>
            <strong>Departure:</strong>{" "}
            {new Date(rideOffer.departure_time).toLocaleString()}
          </p>
          <p>
            <strong>Vehicle:</strong> {rideOffer.vehicle_type_snapshot}
          </p>
          <p>
            <strong>Available Seats:</strong> {rideOffer.available_seats} /{" "}
            {rideOffer.seat_capacity_snapshot}
          </p>
          <p>
            <strong>Notes:</strong> {rideOffer.notes || "-"}
          </p>
        </div>

        <div className="modal-actions">
          {isOwner && rideOffer.status === "open" && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => onCancel(rideOffer.ride_offer_id)}
            >
              Cancel Offer
            </button>
          )}

          {currentUserRole === "Passenger" && rideOffer.status === "open" && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onRequestSeat(rideOffer)}
            >
              Request Seat
            </button>
          )}

          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default RideOfferDetailsModal;
