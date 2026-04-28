import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../features/profile/UserContext";

function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem("token");
  const { user, loading } = useUser();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/homepage" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
