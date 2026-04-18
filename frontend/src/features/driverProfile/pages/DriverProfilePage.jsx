import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createDriverProfile,
  getMyDriverProfile,
} from "../api/driverProfile.api";
import DriverProfileForm from "../DriverProfileForm";

function DriveProfilePage() {
  const navigate = useNavigate();

  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
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
        setDriver(null);
        setError(null);
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
          <div className="empty-state">
            <h2>No Driver Profile Found</h2>
            <p>
              No Driver Profile Yet You can still use TaraSabay as a passenger.
              If you also want to offer rides, set up your driver profile first.
            </p>
            <button onClick={() => setShowCreateForm(true)}>
              Create Driver Profile
            </button>
          </div>
        )}
      </div>
      {showCreateForm && (
        <DriverProfileForm
          onSubmit={async (payload) => {
            try {
              const response = await createDriverProfile(payload);
              setDriver(response.data);
              setShowCreateForm(false);
            } catch (err) {
              setError(
                err.response?.data?.message || "Failed to create profile",
              );
            }
          }}
        />
      )}
      <button onClick={handleHomepage}>Homepage</button>
    </main>
  );
}

export default DriveProfilePage;
