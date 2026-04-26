import api from "./../../../api/axios";

export async function createRequestResponse(requestData) {
  const response = await api.post("/request-responses", requestData);
  return response.data;
}

export async function getRequestResponsesByRideRequest(request_response_id) {
  const response = await api.get(`/request-responses/${request_response_id}`);
  return response.data;
}

export async function getRequestResponsesByRideRequestId(ride_request_id) {
  const response = await api.get(
    `/ride-request/${ride_request_id}/request-responses`,
  );
  return response.data;
}

export async function getMyRequestResponses() {
  const response = await api.get("/auth/me/request-responses");
  return response.data;
}

export async function acceptRequestResponse(request_response_id) {
  const response = await api.patch(
    `/request-responses/${request_response_id}/accept`,
  );
  return response.data;
}

export async function rejectRequestResponse(request_response_id) {
  const response = await api.patch(
    `/request-responses/${request_response_id}/reject`,
  );
  return response.data;
}

export async function cancelRequestResponse(request_response_id) {
  const response = await api.patch(
    `/request-responses/${request_response_id}/cancel`,
  );
  return response.data;
}
