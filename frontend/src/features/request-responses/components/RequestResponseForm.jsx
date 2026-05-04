import { useState } from "react";
import { cleanString } from "./../../../utils/helper";

function RequestResponseForm({
  onSubmit,
  loading,
  initialValues,
  ride_request_id,
  driver_user_id,
}) {
  const [message, setMessage] = useState(initialValues?.message || "");
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);

    const cleanedMessage = cleanString(message);
    if (cleanedMessage && cleanedMessage.length > 500) {
      setError("Message is too long (max 500 characters).");
      return;
    }

    const payload = {
      ride_request_id,
      driver_user_id,
      message: cleanedMessage || null,
    };

    onSubmit(payload);
  };

  return (
    <form className="request-response-form" onSubmit={handleSubmit}>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message (optional)"
        disabled={loading}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Response"}
      </button>
    </form>
  );
}

export default RequestResponseForm;
