import api from "./../../../api/axios";

export async function getMyDriverProfile() {
  const response = await api.get("/auth/me/driver-profile");
  return response.data;
}

export async function createDriverProfile(driverData) {
  const response = await api.post("/driver", driverData);
  return response.data;
}

export async function updateDriverProfile(driver_profile_id, payload) {
  const response = await api.patch(`/driver/${driver_profile_id}`, payload);
  return response.data;
}
