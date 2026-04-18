import { useEffect, useState } from "react";
import { getMyDriverProfile } from "../api/driverProfile.api";

function DriveProfilePage() {
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDriverProfile = async () => {
      try {
        const response = await getMyDriverProfile();
        setDriver(response.data);
      } catch (err) {
        console.error("Failed to fetch driver profile:", err);
        setError(err.response?.data?.message || "Error fetching ride offers");
      } finally {
        setLoading(false);
      }
    };
    fetchDriverProfile();
  }, []);

  const handleHomepage = () => {
    navigate("/homepage");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <main>
      <div>
        {driver ? (
          <div>
            <h1>Driver Profile</h1>
            <p>Manage your driver setup information for offering rides.</p>
            <ul>
              <li>Name: {driver.user_full_name}</li>
              <li>Vehicle: {driver.vehicle_type}</li>
              <li>Seats: {driver.seat_capacity}</li>
              <li>Created at: {driver.created_at}</li>
              <li>Updated at: {driver.updated_at}</li>
            </ul>
          </div>
        ) : (
          <p>No driver profile found.</p>
        )}
      </div>
      <button onClick={handleHomepage}>Homepage </button>
    </main>
  );
}

export default DriveProfilePage;
