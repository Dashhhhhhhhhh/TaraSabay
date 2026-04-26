import "./../css/MessageList.css";

function MessageList({ messages, onViewMessage }) {
  const getMessageContext = (message) => {
    if (message.ride_offer_id) return "Ride Offer";
    if (message.ride_request_id) return "Ride Request";
    if (message.offer_request_id) return "Offer Request";
    if (message.request_response_id) return "Request Response";
    return "-";
  };

  return (
    <table className="my-messages-table">
      <thead>
        <tr>
          <th>From</th>
          <th>To</th>
          <th>Message</th>
          <th>Context</th>
          <th>Status</th>
          <th>Sent At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {messages.map((mes) => (
          <tr key={mes.message_id}>
            <td>{mes.sender_full_name}</td>
            <td>{mes.receiver_full_name}</td>
            <td>{mes.message_text}</td>
            <td>{getMessageContext(mes)}</td>
            <td>{mes.is_read ? "Read" : "Unread"}</td>
            <td>{new Date(mes.created_at).toLocaleString()}</td>
            <td>
              <button onClick={() => onViewMessage?.(mes)}>View</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default MessageList;
