import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const isLoggedIn =
    localStorage.getItem("notesKeeperLoggedIn") === "true";

  let currentUser = null;

  try {
    currentUser = JSON.parse(
      localStorage.getItem("notesKeeperCurrentUser") || "null"
    );
  } catch {
    currentUser = null;
  }

  if (!isLoggedIn || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (role && currentUser.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;