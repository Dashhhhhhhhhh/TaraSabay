import RideRequestResponsesList from "./RideRequestResponsesList";

import "./../css/RideRequestResponseModal.css";

function RideRequestResponseModal({ rideRequest, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Responses for Request</h3>
        <RideRequestResponsesList rideRequestId={rideRequest.ride_request_id} />
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default RideRequestResponseModal;
