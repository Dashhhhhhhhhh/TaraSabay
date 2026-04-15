import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return (
      <main>
        <h1>Welcome</h1>
        <p>Please log in to continue.</p>
      </main>
    );
  }

  const fullName = `${user.first_name} ${user?.middle_initial ? user.middle_initial + "." : ""} ${user.last_name}`;

  const handleProfile = () => {
    navigate("/profile");
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <main>
      <h1>Welcome back, {fullName}</h1>
      <p>
        TaraSabay makes commuting easier by connecting riders and drivers for
        shared journeys.
      </p>
      <p>You are now logged in to your dashboard.</p>

      <button disabled>Ride Offers (Coming Soon)</button>
      <button disabled>Ride Requests (Coming Soon)</button>
      <button disabled>Messages (Coming Soon)</button>
      <button disabled>Reports (Coming Soon)</button>
      <button onClick={handleProfile}>Profile </button>
      <button onClick={handleLogout}>Log Out</button>
    </main>
  );
}

export default HomePage;
