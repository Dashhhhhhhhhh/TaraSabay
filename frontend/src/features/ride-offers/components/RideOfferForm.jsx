import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cleanName, cleanString, toDatetimeLocal } from "../../../utils/helper";

function CreateRideOfferForm({ onSubmit, initialValues }) {
  const navigate = useNavigate();

  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialValues) {
      setPickupLocation(initialValues.pickup_location || "");
      setDropoffLocation(initialValues.dropoff_location || "");
      setDepartureTime(initialValues.departure_time || "");
      setNotes(initialValues.notes || "");
    }
  }, [initialValues]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const cleanPickupLocation = cleanName(pickupLocation);
      const cleanDropOffLocation = cleanName(dropoffLocation);

      if (!cleanPickupLocation || !cleanDropOffLocation || !departureTime) {
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

      const payload = {
        pickup_location: cleanPickupLocation,
        dropoff_location: cleanDropOffLocation,
        departure_time: departureDate.toISOString(),
        notes: note || null,
      };

      if (initialValues?.ride_offer_id) {
        await onSubmit(initialValues.ride_offer_id, payload);
      } else {
        await onSubmit(payload);
      }
    } catch (err) {
      setError("Something went wrong while submitting.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/ride-offer");
  };

  return (
    <main>
      <h1>{initialValues ? "Edit Ride Offer" : "Create Ride Offer"}</h1>
      <p>
        {initialValues
          ? "Update the trip details below."
          : "Fill in the trip details below to post your ride for passengers."}
      </p>

      {loading && <p>Submitting...</p>}
      {error && (
        <p style={{ color: "red", marginBottom: "1rem" }}>Error: {error}</p>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="pickup_location">Pickup Location</label>
          <input
            id="pickup_location"
            type="text"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="dropoff_location">Dropoff Location</label>
          <input
            id="dropoff_location"
            type="text"
            value={dropoffLocation}
            onChange={(e) => setDropoffLocation(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="departure_time">Departure Time</label>
          <input
            id="departure_time"
            type="datetime-local"
            value={departureTime ? toDatetimeLocal(departureTime) : ""}
            onChange={(e) => setDepartureTime(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="notes">Notes (optional)</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={500}
            disabled={loading}
            rows={5}
          />
        </div>

        <button type="submit" disabled={loading}>
          {initialValues ? "Update Offer" : "Create Offer"}
        </button>

        <button onClick={handleCancel} type="button" disabled={loading}>
          Cancel
        </button>
      </form>
    </main>
  );
}

export default CreateRideOfferForm;
