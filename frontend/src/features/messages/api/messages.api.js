import api from "./../../../api/axios";

export async function createMessage(messageData) {
  const response = await api.post("/messages", messageData);
  return response.data;
}

export async function getMyMessages() {
  const response = await api.get("/auth/me/messages");
  return response.data;
}

export async function getMessageById(message_id) {
  const response = await api.get(`/messages/${message_id}`);
  return response.data;w
}

export async function markMessageAsRead(message_id) {
  const response = await api.patch(`/messages/${message_id}/read`);
  return response.data;
}
