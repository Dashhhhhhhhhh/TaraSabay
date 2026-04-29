import { useUser } from "../UserContext";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const navigate = useNavigate();
  const { user, loading, error } = useUser();

  const handleHomepage = () => {
    navigate("/homepage");
  };

  if (loading) return <p>Loading user data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>No user found. Please log in.</p>;

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <h1>
            Welcome back, {user.first_name}{" "}
            {user.middle_initial ? user.middle_initial + "." : ""}{" "}
            {user.last_name}
          </h1>
          <p>View your account information and current TaraSabay role.</p>
        </div>

        <div className="page-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleHomepage}
          >
            Homepage
          </button>
        </div>
      </div>

      <section className="profile-card">
        <h2>User Profile</h2>

        <div className="detail-list">
          <div className="detail-row">
            <span>First Name</span>
            <strong>{user.first_name}</strong>
          </div>

          <div className="detail-row">
            <span>Middle Initial</span>
            <strong>{user.middle_initial || "-"}</strong>
          </div>

          <div className="detail-row">
            <span>Last Name</span>
            <strong>{user.last_name}</strong>
          </div>

          <div className="detail-row">
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>

          <div className="detail-row">
            <span>Role</span>
            <strong>{user.role}</strong>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProfilePage;
