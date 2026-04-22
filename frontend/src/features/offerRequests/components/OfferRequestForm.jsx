import { useState } from "react";

import { cleanString } from "./../../../utils/helper";

function OfferRequestForm({ onSubmit, maxSeats, loading }) {
  const [requestedSeats, setRequestedSeats] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);

    const parsedRequestedSeats = Number(requestedSeats);
    if (!Number.isInteger(parsedRequestedSeats)) {
      setError("Requested seat must be a valid number.");
      return;
    }
    if (parsedRequestedSeats <= 0) {
      setError("Requested seats must be greater than 0");
      return;
    }
    if (parsedRequestedSeats > maxSeats) {
      setError(`You can only request up to ${maxSeats} seats.`);
      return;
    }

    const cleanedMessage = cleanString(message);
    if (cleanedMessage && cleanedMessage.length > 500) {
      setError("Message is too long (max 500 characters).");
      return;
    }

    const payload = {
      requested_seats: parsedRequestedSeats,
      message: cleanedMessage || null,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={requestedSeats}
        onChange={(e) => setRequestedSeats(e.target.value)}
        placeholder="Seats requested"
        max={maxSeats}
        min={1}
        disabled={loading}
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message (optional)"
        disabled={loading}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}

export default OfferRequestForm;
