import api from "../../api/axios";

export async function getProfile() {
  const response = await api.get(`/auth/me`);
  return response.data;
}
