function DriverProfileCard({ driver, onEdit }) {
  if (!driver) return null;

  return (
    <div className="driver-profile-card">
      <h1>Driver Profile</h1>
      <p>Manage your driver setup information for offering rides.</p>
      <ul>
        <li>Name: {driver.user_full_name}</li>
        <li>Vehicle: {driver.vehicle_type}</li>
        <li>Seats: {driver.seat_capacity}</li>
        <li>Created at: {driver.created_at}</li>
        <li>Updated at: {driver.updated_at}</li>
      </ul>
      <button onClick={onEdit}>Edit Profile</button>
    </div>
  );
}

export default DriverProfileCard;
