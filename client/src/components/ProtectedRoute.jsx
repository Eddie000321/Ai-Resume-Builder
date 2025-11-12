import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function ProtectedRoute({ children }) {
  const location = useLocation();
  const { data, isFetching, isError } = useAuth();

  if (isFetching) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-sm text-slate-500">Loading session...</p>
      </div>
    );
  }

  if (isError || !data) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
