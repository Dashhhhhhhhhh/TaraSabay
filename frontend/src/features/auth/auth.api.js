import api from "../../api/axios";

export function registerUser(userData) {
  return api.post("/auth/register", userData);
}

export function loginUser(userData) {
  return api.post("/auth/login", userData);
}
