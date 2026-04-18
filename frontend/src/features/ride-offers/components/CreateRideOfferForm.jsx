import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRideOffer } from "../api/rideOffers.api";
import { cleanName, cleanString } from "../../../utils/helper";

function CreateRideOfferForm() {
  const navigate = useNavigate();

  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

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

    setLoading(true);

    const payload = {
      pickup_location: cleanPickupLocation,
      dropoff_location: cleanDropOffLocation,
      departure_time: departureDate.toISOString(),
      notes: note || null,
    };

    try {
      const response = await createRideOffer(payload);
      console.log("Ride offer created successfully:", response.data);
      navigate("/ride-offer");
    } catch (error) {
      console.error("Failed to create ride offer:", error);
      setError(error.response?.data?.message || "Error creating ride offer");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/ride-offer");
  };
  return (
    <main>
      <h1>Create Ride Offer</h1>
      <p>Fill in the trip details below to post your ride for passengers.</p>

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
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            required
            disabled={loading}
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
          Create Offer
        </button>
        <button onClick={handleCancel} type="button" disabled={loading}>
          cancel
        </button>
      </form>
    </main>
  );
}

export default CreateRideOfferForm;
