import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Route protection wrapper strictly for Admin routes.
 * Checks for dedicated adminToken in localStorage.
 * Redirects unauthenticated requests to /admin/login.
 */
export const AdminRoute = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');

  if (!adminToken) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};
