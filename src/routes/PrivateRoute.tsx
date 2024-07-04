import React from 'react';
import { Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
  element: React.ReactNode;
  role?: 'admin' | 'user';
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, role }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (role && user?.roleType !== role) {
    return <Navigate to="/login" />;
  }

  return element as JSX.Element;
};

export default PrivateRoute;

