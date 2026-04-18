import React from "react";
import ProtectedRoute from "../../components/admin/protectedRoute";

export default function AdminProtectedRouteFeature({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
