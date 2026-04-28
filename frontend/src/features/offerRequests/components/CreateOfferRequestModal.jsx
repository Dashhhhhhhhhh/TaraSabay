import { useState, useEffect } from "react";
import { createOfferRequest } from "../api/offerRequests.api";
import OfferRequestForm from "./OfferRequestForm";

function CreateOfferRequestModal({ offer, onClose }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [, setSuccess] = useState(null);

  useEffect(() => {
    return () => {
      setError(null);
      setLoading(false);
      setSuccess(null);
    };
  }, []);

  if (!offer) return null;

  const handleCreateOfferRequest = async (payload) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await createOfferRequest(payload);
      setSuccess("Offer Request created successfully!");
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create offer request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="offer-request-modal" onClick={() => !loading && onClose()}>
      <div
        className="offer-request-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Create Offer Request</h2>
        <p>
          <strong>Pickup:</strong> {offer.pickup_location}
        </p>
        <p>
          <strong>Dropoff:</strong> {offer.dropoff_location}
        </p>
        <p>
          <strong>Departure:</strong>{" "}
          {new Date(offer.departure_time).toLocaleString()}
        </p>

        <OfferRequestForm
          maxSeats={offer.available_seats}
          onSubmit={(payload) => {
            const fullPayload = {
              ride_offer_id: offer.ride_offer_id,
              ...payload,
            };
            handleCreateOfferRequest(fullPayload);
          }}
          loading={loading}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default CreateOfferRequestModal;
