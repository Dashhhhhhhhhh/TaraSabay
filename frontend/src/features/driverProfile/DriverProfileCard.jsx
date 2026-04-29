function DriverProfileCard({ driver, onEdit }) {
  if (!driver) return null;

  return (
    <section className="detail-card">
      <div className="card-header">
        <div>
          <h2>Driver Information</h2>
          <p>Your current driver setup for offering rides.</p>
        </div>

        <button type="button" className="btn btn-primary" onClick={onEdit}>
          Edit Profile
        </button>
      </div>

      <div className="detail-list">
        <div className="detail-row">
          <span>Name</span>
          <strong>{driver.user_full_name}</strong>
        </div>

        <div className="detail-row">
          <span>Vehicle</span>
          <strong>{driver.vehicle_type}</strong>
        </div>

        <div className="detail-row">
          <span>Seats</span>
          <strong>{driver.seat_capacity}</strong>
        </div>

        <div className="detail-row">
          <span>Created At</span>
          <strong>{new Date(driver.created_at).toLocaleString()}</strong>
        </div>

        <div className="detail-row">
          <span>Updated At</span>
          <strong>{new Date(driver.updated_at).toLocaleString()}</strong>
        </div>
      </div>
    </section>
  );
}

export default DriverProfileCard;
