import api from "./../../../api/axios";

export async function createRideOffer(offerData) {
  const response = await api.post("/ride-offer", offerData);
  return response.data;
}

export async function getRideOffers() {
  const response = await api.get("/ride-offer");
  return response.data;
}

export async function getRideOfferById(ride_offer_id) {
  const response = await api.get(`/ride-offer/${ride_offer_id}`);
  return response.data;
}

export async function updateRideOffer(ride_offer_id, payload) {
  const response = await api.patch(`/ride-offer/${ride_offer_id}`, payload);
  return response.data;
}

export async function cancelRideOffer(ride_offer_id) {
  const response = await api.patch(`/ride-offer/${ride_offer_id}/cancel`);
  return response.data;
}
