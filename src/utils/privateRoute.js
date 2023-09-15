import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ path, element }) => {
  const auth = useSelector((state) => state.auth.isAuthenticated);

  if (auth) {
    return <Outlet />
  } else {
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;
