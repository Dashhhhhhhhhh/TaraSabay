import api from "./../../../api/axios";

export async function createRideRequest(rideData) {
  const response = await api.post("/ride-request", rideData);
  return response.data;
}

export async function getAllRideRequests() {
  const response = await api.get("/ride-request");
  return response.data;
}

export async function getRideRequestById(ride_request_id) {
  const response = await api.get(`/ride-request/${ride_request_id}`);
  return response.data;
}

export async function cancelRideRequest(ride_request_id) {
  const response = await api.patch(`/ride-request/${ride_request_id}/cancel`);
  return response.data;
}

export async function getRequestResponsesByRideRequestId(ride_request_id) {
  const response = await api.get(
    `/ride-request/${ride_request_id}/request-responses`,
  );
  return response.data;
}

export async function getMyRideRequest() {
  const response = await api.get("/auth/me/ride-request");
  return response.data;
}
