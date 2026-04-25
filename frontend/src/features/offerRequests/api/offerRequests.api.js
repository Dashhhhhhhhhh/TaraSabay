import api from "./../../../api/axios";

export async function createOfferRequest(offerData) {
  const response = await api.post("offer-request", offerData);
  return response.data;
}

export async function getOfferRequestById(offer_request_id) {
  const response = await api.get(`/offer-request/${offer_request_id}`);
  return response.data;
}

export async function cancelOfferRequest(offer_request_id) {
  const response = await api.patch(`/offer-request/${offer_request_id}`);
  return response.data;
}

export async function getMyOfferRequests() {
  const response = await api.get("/auth/me/offer-requests");
  return response.data;
}

export async function acceptOfferRequest(offer_request_id) {
  const response = await api.patch(`/offer-request/${offer_request_id}/accept`);
  return response.data;
}

export async function rejectOfferRequest(offer_request_id) {
  const response = await api.patch(`/offer-request/${offer_request_id}/reject`);
  return response.data;
}
