import { Navigate } from 'react-router-dom';
import ScannerProtectedRouteFeature from '../../features/auth/scanner-protected-route';

export default function ScannerProtectedRoute({ children }) {
  return <ScannerProtectedRouteFeature>{children}</ScannerProtectedRouteFeature>;
}