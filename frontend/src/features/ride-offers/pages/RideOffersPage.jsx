import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getRideOffers, createRideOffer } from "../api/rideOffers.api";
import RideOfferList from "../components/RideOfferList";
import RideOfferForm from "../components/RideOfferForm";
import RideOfferDetailsModal from "../components/RideOfferDetailsModal";
function RideOfferPage() {
  const navigate = useNavigate();

  const [rideOffers, setRideOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedRideOffer, setSelectedRideOffer] = useState(null);

  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const fetchRideOffers = async () => {
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
    fetchRideOffers();
  }, []);

  const handleViewRideOffer = (offer) => {
    setSelectedRideOffer(offer);
  };

  const handleHomepage = () => {
    navigate("/homepage");
  };

  const handleCreateRide = () => {
    navigate("/ride-offer/ride-offer-form");
  };

  const handleCloseModal = () => {
    setSelectedRideOffer(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!rideOffers || rideOffers.length === 0)
    return <p>No ride offers found.</p>;

  return (
    <main>
      <h1>Ride Offers</h1>
      <p>View current transportation options in TaraSabay</p>

      <button onClick={handleCreateRide}>Create Ride</button>
      <button onClick={handleHomepage}>Homepage</button>

      <RideOfferList
        rideOffers={rideOffers}
        onViewRideOffer={handleViewRideOffer}
      />

      {selectedRideOffer && (
        <RideOfferDetailsModal
          rideOffer={selectedRideOffer}
          onClose={handleCloseModal}
        />
      )}

      {showCreateForm && (
        <RideOfferForm
          onSubmit={async (payload) => {
            try {
              await createRideOffer(payload);
              const response = await getRideOffers();
              setRideOffers(response.data);
              setShowCreateForm(false);
            } catch (err) {
              setError(
                err.response?.data?.message || "Failed to create profile",
              );
            }
          }}
        />
      )}
    </main>
  );
}

export default RideOfferPage;
