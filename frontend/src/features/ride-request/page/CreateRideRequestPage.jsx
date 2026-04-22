import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRideRequest } from "../api/rideRequests.api";

import RideRequestForm from "../components/RideRequestForm";

function CreateRideRequestPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async (payload) => {
    setLoading(true);
    setError(null);

    try {
      await createRideRequest(payload);
      navigate("/ride-request");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create ride request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <RideRequestForm onSubmit={handleCreate} loading={loading} />
    </main>
  );
}

export default CreateRideRequestPage;
