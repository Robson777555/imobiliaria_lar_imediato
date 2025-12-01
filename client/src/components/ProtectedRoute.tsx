import { useEffect, useRef } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { loading, isAuthenticated } = useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!loading && !isAuthenticated && !hasRedirected.current) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        hasRedirected.current = true;
        const returnTo = encodeURIComponent(currentPath + window.location.search);
        window.location.replace(`/login?returnTo=${returnTo}`);
        return;
      }
    }
  }, [loading, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Verificando autenticação...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (!hasRedirected.current) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        hasRedirected.current = true;
        const returnTo = encodeURIComponent(currentPath + window.location.search);
        window.location.replace(`/login?returnTo=${returnTo}`);
      }
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Redirecionando para login...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

