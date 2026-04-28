import { useState } from "react";
import { cleanString } from "../../../utils/helper";

function CreateMessageForm({ onSubmit }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const message_text = cleanString(message);

    if (!message_text || message_text.length === 0) {
      setError("Message cannot be empty.");
      return;
    }

    if (message_text.length > 1000) {
      setError("Message is too long (max 1000 characters).");
      return;
    }

    setLoading(true);

    try {
      await onSubmit({ message_text });
      setMessage("");
    } catch {
      setError("Something went wrong while submitting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="message_text">Message</label>
      <textarea
        id="message_text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here"
        rows={5}
        disabled={loading}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

export default CreateMessageForm;
