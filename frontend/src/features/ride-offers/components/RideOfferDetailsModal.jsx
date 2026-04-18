import "./../css/RideOfferDetailsModal.css";

function RideOfferDetailsModal({ rideOffer, onClose }) {
  if (!rideOffer) return null;

  return (
    <div className="ride-offer-modal">
      <div
        className="ride-offer-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Ride Offer Details</h2>
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
          <strong>Seats:</strong> {rideOffer.available_seats} /{" "}
          {rideOffer.seat_capacity_snapshot}
        </p>
        <p>
          <strong>Status:</strong> {rideOffer.status}
        </p>
        <p>
          <strong>Notes:</strong> {rideOffer.notes || "-"}
        </p>

        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default RideOfferDetailsModal;
