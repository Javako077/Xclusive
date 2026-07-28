import React from 'react';
import { Navigate } from 'react-router-dom';

export const AdminRoute = ({ user, children }) => {
  const token = localStorage.getItem('token');

  // If no user or token present, redirect to landing page
  if (!user && !token) {
    return <Navigate to="/" replace />;
  }

  // If user object is loaded and role is NOT admin, deny access & redirect to /dashboard
  if (user && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
