function RideRequestList({ rideRequests, onViewRideRequest }) {
  if (rideRequests.length === 0) {
    return <p>No ride requests found.</p>;
  }

  return (
    <table className="ride-requests-table">
      <thead>
        <tr>
          <th>Pickup</th>
          <th>Dropoff</th>
          <th>Departure</th>
          <th>Requested Seats</th>
          <th>Notes</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {rideRequests.map((req) => (
          <tr key={req.ride_request_id}>
            <td>{req.pickup_location}</td>
            <td>{req.dropoff_location}</td>
            <td>{new Date(req.departure_time).toLocaleString()}</td>
            <td>{req.requested_seats}</td>
            <td>{req.notes || "-"}</td>
            <td>{req.status}</td>
            <td>
              {req.status === "open" && (
                <button type="button" onClick={() => onViewRideRequest(req)}>
                  Respond
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default RideRequestList;
