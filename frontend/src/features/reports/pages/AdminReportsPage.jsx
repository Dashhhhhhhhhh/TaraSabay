import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllReportsForAdmin } from "../api/reports.api";

import "../css/MyReportsPage.css";

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
    <main className="page">
      <div className="my-reports-page">
        <div className="page-header">
          <div>
            <h1>Admin Reports</h1>
            <p>View and manage all submitted reports.</p>
          </div>

          <div className="page-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleBack}
            >
              Back to Homepage
            </button>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table my-reports-table">
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
                  <tr key={report.report_id || report.message_id}>
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
                    <td>
                      <span className={`status-badge status-${report.status}`}>
                        {report.status}
                      </span>
                    </td>
                    <td>{new Date(report.created_at).toLocaleString()}</td>
                    <td>{new Date(report.updated_at).toLocaleString()}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleViewReport(report)}
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {selectedReport && (
          <div
            className="report-details-modal-overlay"
            onClick={() => setSelectedReport(null)}
          >
            <div
              className="report-details-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Admin Report Details</h2>
                <span
                  className={`status-badge status-${selectedReport.status}`}
                >
                  {selectedReport.status}
                </span>
              </div>

              <div className="modal-details">
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
                  <strong>Created At:</strong>{" "}
                  {new Date(selectedReport.created_at).toLocaleString()}
                </p>
                <p>
                  <strong>Updated At:</strong>{" "}
                  {new Date(selectedReport.updated_at).toLocaleString()}
                </p>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedReport(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default AdminReportsPage;
