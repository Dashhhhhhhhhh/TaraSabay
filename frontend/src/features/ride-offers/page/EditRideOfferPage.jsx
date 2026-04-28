import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateRideOffer, getRideOfferById } from "../api/rideOffers.api";

import RideOfferForm from "../components/RideOfferForm";

function EditRideOfferPage() {
  const { ride_offer_id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [offer, setOffer] = useState(null);
  const [, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const response = await getRideOfferById(ride_offer_id);
        setOffer(response.data);
      } catch {
        setError("Failed to load ride offer");
      }
    };
    fetchOffer();
  }, [ride_offer_id]);

  const handleUpdate = async (ride_offer_id, payload) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await updateRideOffer(ride_offer_id, payload);
      navigate("/ride-offer");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update ride offer");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!offer) return <p>Loading...</p>;

  return (
    <main>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <RideOfferForm initialValues={offer} onSubmit={handleUpdate} />
    </main>
  );
}

export default EditRideOfferPage;
