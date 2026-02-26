import React from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useManualAuth } from '../hooks/useManualAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const { isManuallyAuthenticated } = useManualAuth();

  const isAuthenticated = !!identity || isManuallyAuthenticated;

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.hash = '/login';
    return null;
  }

  return <>{children}</>;
}
