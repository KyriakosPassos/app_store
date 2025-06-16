import React, { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthenticationContext";

const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user } = useAuth();
  const loc = useLocation();

  if (user) return children;

  // redirect to /login but remember where they were going
  return <Navigate to="/login" state={{ from: loc }} replace />;
};

export default React.memo(RequireAuth);
