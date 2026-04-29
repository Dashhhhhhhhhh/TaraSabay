import { useState } from "react";
import { cleanString } from "../../../utils/helper";
function CreateReportForm({ onSubmit }) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const cleanReason = cleanString(reason);
    if (!cleanReason) {
      setError("A reason must be provided to complete this request.");
      return;
    }

    if (cleanReason.length > 1000) {
      setError("Reason is too long (max 1000 characters).");
      return;
    }

    const cleanDetails = cleanString(details);
    if (cleanDetails.length > 1000) {
      setError("Details are too long (max 1000 characters).");
      return;
    }

    const payload = { reason: cleanReason, details: cleanDetails };

    setLoading(true);

    try {
      await onSubmit(payload);
      setReason("");
      setDetails("");
    } catch {
      setError("Something went wrong while submitting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="reason">Reason</label>
      <textarea
        id="reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Type your reason here"
        rows={5}
        disabled={loading}
      />

      <label htmlFor="details">Details</label>
      <textarea
        id="details"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        placeholder="Type your details here"
        rows={5}
        disabled={loading}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Submit..." : "Submit Report"}
      </button>
    </form>
  );
}

export default CreateReportForm;
