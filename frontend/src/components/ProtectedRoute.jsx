import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Wrap any page with this to require login.
// Usage: <ProtectedRoute><Feed /></ProtectedRoute>
function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
