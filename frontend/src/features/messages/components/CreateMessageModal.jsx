import { useState } from "react";
import { createMessage } from "../api/messages.api";

import CreateMessageForm from "./CreateMessageForm";

function CreateMessageModal({
  onClose,
  receiver_user_id,
  ride_offer_id,
  ride_request_id,
  onSuccess,
}) {
  const [, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [, setSuccess] = useState(null);

  const handleCreateMessage = async (payload) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await createMessage(payload);
      setSuccess("Message created successfully!");
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="message-modal" onClick={() => !loading && onClose()}>
      <div
        className="message-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Create Message</h2>

        <CreateMessageForm
          onSubmit={(payload) => {
            const fullPayload = {
              receiver_user_id,
              ride_offer_id,
              ride_request_id,
              ...payload,
            };
            return handleCreateMessage(fullPayload);
          }}
        />

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

export default CreateMessageModal;
