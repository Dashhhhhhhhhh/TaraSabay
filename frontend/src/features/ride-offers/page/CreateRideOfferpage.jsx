import { useNavigate } from "react-router-dom";
import { createRideOffer } from "../api/rideOffers.api";
import { useEffect, useState } from "react";

import RideOfferForm from "./../components/RideOfferForm";

function CreateRideOfferPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleCreate = async (payload) => {
    try {
      await createRideOffer(payload);
      navigate("/ride-offer");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create ride offer");
    }
  };

  return (
    <main>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <RideOfferForm onSubmit={handleCreate} />
    </main>
  );
}

export default CreateRideOfferPage;
