import RideRequestResponsesList from "./RideRequestResponsesList";

import "./../css/RideRequestResponseModal.css";

function RideRequestResponseModal({ rideRequest, onClose }) {
  return (
    <div className="request-response-modal-overlay">
      <div className="request-response-modal-content">
        <div className="modal-header">
          <h2>Responses for Request</h2>
        </div>

        <RideRequestResponsesList rideRequestId={rideRequest.ride_request_id} />

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
export default RideRequestResponseModal;
