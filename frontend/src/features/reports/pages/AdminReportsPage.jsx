import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllReportsForAdmin } from "../api/reports.api";

function AdminReportsPage() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  const fetchMyAdminReports = async () => {
    try {
      const response = await getAllReportsForAdmin();
      setReports(response.data || []);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      setError("Failed to fetch reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyAdminReports();
  }, []);

  const handleViewReport = (report) => {
    setSelectedReport(report);
  };

  const handleBack = () => {
    navigate("/homepage");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="admin-reports-page">
      <h2>Reports</h2>

      <table className="admin-reports-table">
        <thead>
          <tr>
            <th>Target</th>
            <th>Reason</th>
            <th>Details</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.length === 0 ? (
            <tr>
              <td colSpan={7} className="my-reports-empty">
                No reports found.
              </td>
            </tr>
          ) : (
            reports.map((report) => (
              <tr key={report.report_id}>
                <td>
                  {report.reported_user_id
                    ? "User"
                    : report.ride_offer_id
                      ? "Ride Offer"
                      : report.ride_request_id
                        ? "Ride Request"
                        : report.message_id
                          ? "Message"
                          : "-"}
                </td>
                <td>{report.reason}</td>
                <td>{report.details || "-"}</td>
                <td>{report.status}</td>
                <td>{new Date(report.created_at).toLocaleString()}</td>
                <td>{new Date(report.updated_at).toLocaleString()}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleViewReport(report)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {selectedReport && (
        <div className="selected-admin-report">
          <h3>Admin Report Details</h3>
          <p>
            <strong>Target:</strong>{" "}
            {selectedReport.reported_user_id
              ? "User"
              : selectedReport.ride_offer_id
                ? "Ride Offer"
                : selectedReport.ride_request_id
                  ? "Ride Request"
                  : selectedReport.message_id
                    ? "Message"
                    : "-"}
          </p>
          <p>
            <strong>Reason:</strong> {selectedReport.reason}
          </p>
          <p>
            <strong>Details:</strong> {selectedReport.details || "-"}
          </p>
          <p>
            <strong>Status:</strong> {selectedReport.status}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(selectedReport.created_at).toLocaleString()}
          </p>
          <p>
            <strong>Updated At:</strong>{" "}
            {new Date(selectedReport.updated_at).toLocaleString()}
          </p>
        </div>
      )}

      <button onClick={handleBack}>Back to Homepage</button>
    </div>
  );
}

export default AdminReportsPage;
