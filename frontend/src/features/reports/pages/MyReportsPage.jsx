import { useState, useEffect } from "react";

import { useUser } from "../../../features/profile/UserContext";
import { useNavigate } from "react-router";
import { getMyReports } from "../api/reports.api";

import ReportList from "../components/ReportList";

import "../css/MyReportsPage.css";

function MyReportsPage() {
  const navigate = useNavigate();
  const { user, loading: userLoading, error: userError } = useUser();

  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedReport, setSelectedRepot] = useState(false);

  const fetchMyreports = async () => {
    try {
      const response = await getMyReports();
      setReports(response.data || []);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      setError("Failed to fetch reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyreports();
  }, []);

  const handleViewReport = (reports) => {
    setSelectedRepot(reports);
  };
  const handleBack = () => {
    navigate("/homepage");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="my-reports-page">
      <h2>Reports</h2>

      {reports.length === 0 ? (
        <p className="my-reports-empty">No reports found.</p>
      ) : (
        <ReportList reports={reports} onViewReport={handleViewReport} />
      )}

      {selectedReport && (
        <div className="report-details">
          <h3>Report Details</h3>
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

export default MyReportsPage;
