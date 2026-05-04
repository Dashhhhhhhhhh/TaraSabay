function RideRequestList({ rideRequests, onViewRideRequest }) {
  if (rideRequests.length === 0) {
    return <p>No ride requests found.</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="data-table ride-requests-table">
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
              <td>
                <span className={`status-badge status-${req.status}`}>
                  {req.status}
                </span>
              </td>
              <td>
                <div className="table-actions">
                  {req.status === "open" ? (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => onViewRideRequest(req)}
                    >
                      Respond
                    </button>
                  ) : (
                    <span className="muted-text">No actions</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RideRequestList;
