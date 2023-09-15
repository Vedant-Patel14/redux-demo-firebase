import React from "react";
import {  Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthRoute = ({ path, element }) => {
  const auth = useSelector((state) => state.auth.isAuthenticated);

  if (auth) {
      return <Navigate to="/" />;
    } else {
      return <Outlet />
  }
};

export default AuthRoute;
