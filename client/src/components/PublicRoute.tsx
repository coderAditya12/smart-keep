import { useAuthStore } from "../store/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const { user } = useAuthStore();
  return user ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default PublicRoute;
