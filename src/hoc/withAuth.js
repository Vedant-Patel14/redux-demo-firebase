import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom"; 
import { selectIsAuthenticated } from "../redux/reducers/authSlice";



const AuthHOC = ({ children }) => { 
  const navigate = Navigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("User not authenticated. Redirecting...");
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return navigate("/login")
  }

  return children;
};

const withAuth = (WrappedComponent) => {
  const WithAuthWrapper = (props) => {
    return <AuthHOC><WrappedComponent {...props} /></AuthHOC>;
  };
  return WithAuthWrapper;
};

export default withAuth;
