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
    <main>
      <h1>
        Welcome back, {user.first_name}{" "}
        {user.middle_initial ? user.middle_initial + "." : ""} {user.last_name}
      </h1>
      <h2>User Profile</h2>
      <ul>
        <li>First Name: {user.first_name}</li>
        <li>Middle Initial: {user.middle_initial || "-"}</li>
        <li>Last Name: {user.last_name}</li>
        <li>Email: {user.email}</li>
        <li>Role: {user.role}</li>
      </ul>
      <button onClick={handleHomepage}>Homepage </button>
    </main>
  );
}

export default ProfilePage;
