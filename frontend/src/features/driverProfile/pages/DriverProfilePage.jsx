import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DriverProfileEmptyState from "./../DriverProfileEmptyState";
import DriverProfileForm from "../DriverProfileForm";
import DriverProfileCard from "../DriverProfileCard";

import {
  createDriverProfile,
  getMyDriverProfile,
  updateDriverProfile,
} from "../api/driverProfile.api";

function DriveProfilePage() {
  const navigate = useNavigate();

  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    const fetchDriverProfile = async () => {
      try {
        const response = await getMyDriverProfile();
        setDriver(response.data);
      } catch (err) {
        setDriver(null);
        setError(null);
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
        {driver && !showEditForm ? (
          <DriverProfileCard
            driver={driver}
            onEdit={() => setShowEditForm(true)}
          />
        ) : (
          !driver &&
          !showCreateForm && (
            <DriverProfileEmptyState onCreate={() => setShowCreateForm(true)} />
          )
        )}
      </div>

      {showCreateForm && (
        <DriverProfileForm
          onSubmit={async (payload) => {
            try {
              await createDriverProfile(payload);
              const profile = await getMyDriverProfile();
              setDriver(profile.data);
              setShowCreateForm(false);
            } catch (err) {
              setError(
                err.response?.data?.message || "Failed to create profile",
              );
            }
          }}
        />
      )}

      {showEditForm && (
        <DriverProfileForm
          initialValues={driver}
          onSubmit={async (driver_profile_id, payload) => {
            try {
              await updateDriverProfile(driver.driver_profile_id, payload);

              const profile = await getMyDriverProfile();
              setDriver(profile.data);

              setShowEditForm(false);
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
