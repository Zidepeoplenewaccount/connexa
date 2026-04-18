import React from "react";
import ScannerProtectedRoute from "../../pages/adminScanner/scannerProtectedRoute";

export default function ScannerProtectedRouteFeature({ children }) {
  return <ScannerProtectedRoute>{children}</ScannerProtectedRoute>;
}
