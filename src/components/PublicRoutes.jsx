import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/authContext/useAuthContext";
import { dashboard } from "../constant/routes";

const PublicRoutes = () => {
  const { auth } = useAuthContext();
  return auth.isLogin ? <Navigate to={dashboard} /> : <Outlet />;
};

export default PublicRoutes;
