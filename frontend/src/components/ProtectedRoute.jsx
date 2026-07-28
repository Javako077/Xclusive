import React from 'react';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ user, children }) => {
  const token = localStorage.getItem('token');

  if (!user && !token) {
    return <Navigate to="/" replace />;
  }

  return children;
};
