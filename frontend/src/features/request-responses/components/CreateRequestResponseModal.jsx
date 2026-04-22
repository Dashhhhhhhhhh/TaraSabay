import { useState, useEffect } from "react";
import { createRequestResponse } from "../api/requestResponses.api";
import RequestResponseForm from "./RequestResponseForm";

function CreateRequestResponseModal({ request, onClose }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!request) return null;

  const handleCreateRequestResponse = async (payload) => {
    setLoading(true);
    setError(null);

    try {
      await createRequestResponse(payload);
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create request response",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="request-response-modal"
      onClick={() => {
        if (!loading) {
          onClose();
        }
      }}
    >
      <div
        className="request-response-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Respond to Ride Request</h2>

        <RequestResponseForm
          onSubmit={handleCreateRequestResponse}
          loading={loading}
          initialValues={{}}
          ride_request_id={request.ride_request_id}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="button" onClick={() => !loading && onClose()}>
          Close
        </button>
      </div>
    </div>
  );
}

export default CreateRequestResponseModal;
