import api from "./../../../api/axios";

export async function createReport(reportData) {
  const response = await api.post("/reports", reportData);
  return response.data;
}

export async function getMyReports() {
  const response = await api.get("/auth/me/reports");
  return response.data;
}

export async function getReportById(report_id) {
  const response = await api.get(`/reports/${report_id}`);
  return response.data;
}

export async function getAllReportsForAdmin() {
  const response = await api.get("/reports");
  return response.data;
}
