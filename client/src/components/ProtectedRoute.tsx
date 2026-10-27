import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../store/store";

type ProtectedRouteProps = {
  requireAuth?: boolean;
};

const ProtectedRoute = ({ requireAuth = true }: ProtectedRouteProps) => {
  const isUserLoggedIn = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  if (requireAuth && !isUserLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!requireAuth && isUserLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
