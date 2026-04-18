import { Navigate } from 'react-router-dom';
import AdminProtectedRouteFeature from '../../features/auth/admin-protected-route';

export default function ProtectedRoute({ children }) {
  return <AdminProtectedRouteFeature>{children}</AdminProtectedRouteFeature>;
}