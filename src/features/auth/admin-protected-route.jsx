import React from "react";
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../../services/adminApi';

export default function AdminProtectedRouteFeature({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
