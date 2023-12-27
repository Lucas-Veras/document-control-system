import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../../context/AuthProvider";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useContext(AuthContext);
  return <>{!user ? <Navigate to="/login" replace={true} /> : children}</>;
};

export default PrivateRoute;
