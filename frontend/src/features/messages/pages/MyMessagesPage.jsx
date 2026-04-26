import { useState, useEffect } from "react";
import { getMyMessages } from "../api/messages.api";

import "./../css/MyMessagesPage.css";

import MessageList from "../components/MessageList";
function MyMessagesPages() {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMyMessages = async () => {
    try {
      const response = await getMyMessages();
      setMessages(response.data || []);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      setError("Failed to fetch messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyMessages();
  }, []);

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="my-messages-page">
      <h2>My Messages</h2>
      {messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <MessageList messages={messages} onViewMessage={handleViewMessage} />
      )}
      {selectedMessage && (
        <div className="selected-message">
          <h3>Message List</h3>

          <p>
            <strong>From:</strong> {selectedMessage.sender_full_name}
          </p>

          <p>
            <strong>To:</strong> {selectedMessage.receiver_full_name}
          </p>

          <p>
            <strong>Message:</strong> {selectedMessage.message_text}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {selectedMessage.is_read ? "Read" : "Unread"}
          </p>

          <p>
            <strong>Sent At:</strong>{" "}
            {new Date(selectedMessage.created_at).toLocaleString()}
          </p>

          <button type="button" onClick={() => setSelectedMessage(null)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default MyMessagesPages;
