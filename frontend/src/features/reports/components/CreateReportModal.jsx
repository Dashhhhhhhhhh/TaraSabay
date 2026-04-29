import { useState } from "react";
import { createReport } from "../api/reports.api";
import CreateReportForm from "./CreateReportForm";

function CreateReportModal({
  onClose,
  reported_user_id,
  ride_offer_id,
  ride_request_id,
  message_id,
  onSuccess,
}) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleCreateReport = async (payload) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await createReport(payload);
      setSuccess("Report created successfully!");
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-modal" onClick={() => !loading && onClose()}>
      <div
        className="report-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Create Report</h2>

        <CreateReportForm
          onSubmit={(payload) => {
            let targetPayload = {};

            if (message_id) {
              targetPayload = { message_id };
            } else if (ride_offer_id) {
              targetPayload = { ride_offer_id };
            } else if (ride_request_id) {
              targetPayload = { ride_request_id };
            } else if (reported_user_id) {
              targetPayload = { reported_user_id };
            }

            const fullPayload = {
              ...targetPayload,
              ...payload,
            };

            return handleCreateReport(fullPayload);
          }}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateReportModal;
