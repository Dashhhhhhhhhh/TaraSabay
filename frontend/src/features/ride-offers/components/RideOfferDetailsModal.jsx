import { useState } from "react";
import "./../css/RideOfferDetailsModal.css";
import CreateOfferRequestModal from "../../offerRequests/components/CreateOfferRequestModal";

function RideOfferDetailsModal({
  rideOffer,
  onClose,
  onCancel,
  currentUserId,
}) {
  const [showOfferRequestModal, setShowOfferRequestModal] = useState(false);

  const isOwner = rideOffer.user_id === currentUserId;

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
          <strong>Available Seats:</strong> {rideOffer.available_seats} /{" "}
          {rideOffer.seat_capacity_snapshot}
        </p>
        <p>
          <strong>Status:</strong> {rideOffer.status}
        </p>
        <p>
          <strong>Notes:</strong> {rideOffer.notes || "-"}
        </p>

        {isOwner && rideOffer.status === "open" && (
          <button
            type="button"
            onClick={() => onCancel(rideOffer.ride_offer_id)}
          >
            Cancel Offer
          </button>
        )}

        {!isOwner &&
          rideOffer.status === "open" &&
          rideOffer.available_seats > 0 && (
            <button
              type="button"
              onClick={() => setShowOfferRequestModal(true)}
            >
              Request Seat
            </button>
          )}

        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>

      {showOfferRequestModal && (
        <CreateOfferRequestModal
          offer={rideOffer}
          onClose={() => setShowOfferRequestModal(false)}
        />
      )}
    </div>
  );
}

export default RideOfferDetailsModal;
