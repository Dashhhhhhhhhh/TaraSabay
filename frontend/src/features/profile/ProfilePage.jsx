import { useUser } from "./UserContext";

function ProfilePage() {
  const { user, loading, error } = useUser();

  if (loading) return <p>Loading user data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>No user found. Please log in.</p>;

  return (
    <main>
      <h1>
        Welcome back, {user.first_name}{" "}
        {user.middle_initial ? user.middle_initial + "." : ""} {user.last_name}
      </h1>
    </main>
  );
}

export default ProfilePage;
