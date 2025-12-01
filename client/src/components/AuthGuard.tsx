import { useEffect, useRef } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { loading, isAuthenticated } = useAuth();
  const hasRedirected = useRef(false);

  const publicPaths = ['/login', '/politica-privacidade', '/termos-servico'];
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const isPublicPath = publicPaths.includes(currentPath);

  useEffect(() => {
    if (!isAuthenticated && !isPublicPath && !hasRedirected.current) {
      hasRedirected.current = true;
      const returnTo = encodeURIComponent(currentPath + (typeof window !== 'undefined' ? window.location.search : ''));
      window.location.replace(`/login?returnTo=${returnTo}`);
    }
  }, [isAuthenticated, currentPath, isPublicPath]);

  useEffect(() => {
    if (loading && !isPublicPath && !hasRedirected.current) {
      const timeoutId = setTimeout(() => {
        if (!hasRedirected.current && !isAuthenticated) {
          hasRedirected.current = true;
          const returnTo = encodeURIComponent(currentPath + (typeof window !== 'undefined' ? window.location.search : ''));
          window.location.replace(`/login?returnTo=${returnTo}`);
        }
      }, 200);

      return () => clearTimeout(timeoutId);
    }
  }, [loading, isPublicPath, currentPath, isAuthenticated]);

  if (isPublicPath) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}



