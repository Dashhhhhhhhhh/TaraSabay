import { useState, useEffect } from "react";
import { getMyMessages, markMessageAsRead } from "../api/messages.api";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../features/profile/UserContext";
import CreateMessageModal from "../components/CreateMessageModal";
import CreateReportModal from "../../reports/components/CreateReportModal";
import "./../css/MyMessagesPage.css";
import MessageList from "../components/MessageList";

function MyMessagesPages() {
  const navigate = useNavigate();

  const { user } = useUser();

  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [markReadLoadingId, setMarkReadLoadingId] = useState(null);

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const replyReceiverId =
    selectedMessage && user
      ? user.id === selectedMessage.sender_user_id
        ? selectedMessage.receiver_user_id
        : selectedMessage.sender_user_id
      : null;

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

  const handleMarkAsRead = async (message_id) => {
    try {
      setError(null);
      setMarkReadLoadingId(message_id);

      await markMessageAsRead(message_id);

      await fetchMyMessages();

      setSelectedMessage((prev) =>
        prev && prev.message_id === message_id
          ? { ...prev, is_read: true }
          : prev,
      );
    } catch (err) {
      console.error("Failed to mark message as read:", err);
      setError(
        err.response?.data?.message || "Failed to mark message as read.",
      );
    } finally {
      setMarkReadLoadingId(null);
    }
  };

  const handleBack = () => {
    navigate("/homepage");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <main className="page">
      <div className="my-messages-page">
        <div className="page-header">
          <div>
            <h1>My Messages</h1>
            <p>View ride-related messages, replies, and reports.</p>
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
        {messages.length === 0 ? (
          <p>No messages found.</p>
        ) : (
          <MessageList messages={messages} onViewMessage={handleViewMessage} />
        )}
        {selectedMessage && !showMessageModal && !showReportModal && (
          <div
            className="message-details-modal-overlay"
            onClick={() => setSelectedMessage(null)}
          >
            <div
              className="message-details-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Message Details</h2>
                <span
                  className={`status-badge ${
                    selectedMessage.is_read ? "status-read" : "status-unread"
                  }`}
                >
                  {selectedMessage.is_read ? "Read" : "Unread"}
                </span>
              </div>

              <div className="modal-details">
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
                  <strong>Sent At:</strong>{" "}
                  {new Date(selectedMessage.created_at).toLocaleString()}
                </p>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedMessage(null)}
                >
                  Close
                </button>

                {selectedMessage &&
                  user &&
                  selectedMessage.is_read === false &&
                  selectedMessage.receiver_user_id === user._id && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() =>
                        handleMarkAsRead(selectedMessage.message_id)
                      }
                      disabled={
                        markReadLoadingId === selectedMessage.message_id
                      }
                    >
                      {markReadLoadingId === selectedMessage.message_id
                        ? "Marking..."
                        : "Mark as Read"}
                    </button>
                  )}

                {selectedMessage && user && replyReceiverId && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setShowMessageModal(true)}
                  >
                    Reply
                  </button>
                )}

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    setShowReportModal(true);
                  }}
                >
                  Report
                </button>
              </div>
            </div>
          </div>
        )}
        {showMessageModal && selectedMessage && user && replyReceiverId && (
          <CreateMessageModal
            onClose={() => setShowMessageModal(false)}
            receiver_user_id={replyReceiverId}
            ride_offer_id={selectedMessage.ride_offer_id}
            ride_request_id={selectedMessage.ride_request_id}
            onSuccess={async () => {
              await fetchMyMessages();
              setShowMessageModal(false);
            }}
          />
        )}
        {showReportModal && selectedMessage && (
          <CreateReportModal
            onClose={() => setShowReportModal(false)}
            reported_user_id={selectedMessage.sender_user_id}
            ride_offer_id={selectedMessage.ride_offer_id}
            ride_request_id={selectedMessage.ride_request_id}
            message_id={selectedMessage.message_id}
            onSuccess={() => setShowReportModal(false)}
          />
        )}
      </div>
    </main>
  );
}

export default MyMessagesPages;
