import React from "react";
import { Navigate } from 'react-router-dom';

export default function ScannerProtectedRouteFeature({ children }) {
  const token = localStorage.getItem('admin_token');
  const role = localStorage.getItem('admin_role');

  if (!token) {
    return <Navigate to="/admin" replace />;
  }

  if (role !== 'full' && role !== 'scanner') {
    return <Navigate to="/" replace />;
  }

  return children;
}
