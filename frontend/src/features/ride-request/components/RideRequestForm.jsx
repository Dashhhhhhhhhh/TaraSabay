import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cleanName, cleanString, toDatetimeLocal } from "../../../utils/helper";

function RideRequestForm({ onSubmit, onCancel }) {
  const navigate = useNavigate();

  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [notes, setNotes] = useState("");
  const [requestedSeats, setRequestedSeats] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const cleanPickupLocation = cleanName(pickupLocation);
      const cleanDropOffLocation = cleanName(dropoffLocation);

      if (
        !cleanPickupLocation ||
        !cleanDropOffLocation ||
        !departureTime ||
        !requestedSeats
      ) {
        setError("All required fields must be provided.");
        return;
      }

      if (cleanPickupLocation === cleanDropOffLocation) {
        setError("Pickup and dropoff locations must not be the same.");
        return;
      }

      const departureDate = new Date(departureTime);
      if (isNaN(departureDate.getTime())) {
        setError("Departure time must be a valid timestamp.");
        return;
      }
      if (departureDate <= new Date()) {
        setError("Departure time must be in the future.");
        return;
      }

      const note = cleanString(notes);
      if (note && note.length > 500) {
        setError("Notes is too long (max 500 characters).");
        return;
      }

      const seats = Number(requestedSeats);
      if (!Number.isInteger(seats)) {
        setError("Requested seats must be an integer.");
        return;
      }
      if (seats <= 0) {
        setError("Requested seats must be greater than 0.");
        return;
      }

      const payload = {
        pickup_location: cleanPickupLocation,
        dropoff_location: cleanDropOffLocation,
        departure_time: departureDate.toISOString(),
        requested_seats: seats,
        notes: note || null,
      };

      await onSubmit(payload);
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <main>
      {loading && <p>Submitting...</p>}
      {error && (
        <p style={{ color: "red", marginBottom: "1rem" }}>Error: {error}</p>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Pickup Location</label>
          <input
            type="text"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label>Dropoff Location</label>
          <input
            type="text"
            value={dropoffLocation}
            onChange={(e) => setDropoffLocation(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label>Departure Time</label>
          <input
            type="datetime-local"
            value={departureTime ? toDatetimeLocal(departureTime) : ""}
            onChange={(e) => setDepartureTime(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label>Requested Seats</label>
          <input
            type="number"
            value={requestedSeats}
            onChange={(e) => setRequestedSeats(e.target.value)}
            required
            disabled={loading}
            min={1}
          />
        </div>

        <div>
          <label>Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={500}
            disabled={loading}
            rows={5}
          />
        </div>

        <button type="submit" disabled={loading}>
          Create Request
        </button>
        <button onClick={handleCancel} type="button" disabled={loading}>
          Cancel
        </button>
      </form>
    </main>
  );
}

export default RideRequestForm;
