import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useUser } from "../../../features/profile/UserContext";

import { cancelRideOffer, getRideOffers } from "../api/rideOffers.api";
import RideOfferList from "../components/RideOfferList";
import RideOfferDetailsModal from "../components/RideOfferDetailsModal";

function RideOfferPage() {
  const navigate = useNavigate();

  const { user, loading: userLoading, error: userError } = useUser();

  const [rideOffers, setRideOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [cancelLoading, setCancelLoading] = useState(false);

  const [selectedRideOffer, setSelectedRideOffer] = useState(null);

  const fetchRideOffers = async () => {
    setLoading(true);
    try {
      const response = await getRideOffers();
      setRideOffers(response.data);
    } catch (err) {
      console.error("Failed to fetch ride offers:", err);
      setError(err.response?.data?.message || "Error fetching ride offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRideOffers();
  }, []);

  const handleViewRideOffer = (offer) => {
    setSelectedRideOffer(offer);
  };

  const handleHomepage = () => {
    navigate("/homepage");
  };

  const handleCreateRideOffer = () => {
    navigate("/ride-offer/create");
  };

  const handleCloseModal = () => {
    setSelectedRideOffer(null);
    navigate("/ride-offer");
  };

  const handleCancelHandler = async (ride_offer_id) => {
    if (!user) return;
    try {
      setError(null);
      setCancelLoading(true);

      await cancelRideOffer(ride_offer_id);
      fetchRideOffers();
      setSelectedRideOffer(null);
    } catch (err) {
      console.error("Cancel ride offer failed:", err);

      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        console.error("Response headers:", err.response.headers);
      } else if (err.request) {
        console.error("No response received. Request details:", err.request);
      } else {
        console.error("Error message:", err.message);
      }

      setError(err.response?.data?.message || "Failed to cancel ride offer");
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!rideOffers || rideOffers.length === 0)
    return <p>No ride offers found.</p>;

  return (
    <main>
      <h1>Ride Offers</h1>
      <p>View current transportation options in TaraSabay</p>

      <button onClick={handleHomepage}>Homepage</button>
      <button onClick={handleCreateRideOffer}>Create a Ride Offer</button>

      <RideOfferList
        rideOffers={rideOffers}
        onViewRideOffer={handleViewRideOffer}
      />

      {selectedRideOffer && (
        <RideOfferDetailsModal
          rideOffer={selectedRideOffer}
          onClose={handleCloseModal}
          onCancel={handleCancelHandler}
          currentUserId={user?.user_id}
        />
      )}
    </main>
  );
}

export default RideOfferPage;
