import React from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth(); 
  const location = useLocation();

  if (!isAuthenticated) {
    // If the user is NOT logged in:
    // 1. Redirect them to the /login page
    // 2. Save the page they were *trying* to go to (location)
    //    so we can send them back there after they log in.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }


  return children;
};

export default ProtectedRoute;