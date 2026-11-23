import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../store/store";
import Spinner from "./Spinner";

type ProtectedRouteProps = {
  requireAuth?: boolean;
};

const ProtectedRoute = ({ requireAuth = true }: ProtectedRouteProps) => {
  const { isAuthenticated, authChecked } = useSelector(
    (state: RootState) => state.auth,
  );
  if (!authChecked) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
