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

  // Redirecionamento imediato para login se não autenticado
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Se não for uma rota pública e não estiver autenticado, redirecionar
    if (!isPublicPath && !isAuthenticated && !loading && !hasRedirected.current) {
      hasRedirected.current = true;
      const returnTo = encodeURIComponent(currentPath + window.location.search);
      window.location.replace(`/login?returnTo=${returnTo}`);
      return;
    }
  }, [isAuthenticated, currentPath, isPublicPath, loading]);

  // Se ainda está carregando e não é rota pública, mostrar loading
  if (loading && !isPublicPath) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Verificando autenticação...
          </p>
        </div>
      </div>
    );
  }

  // Se é rota pública, permitir acesso
  if (isPublicPath) {
    return <>{children}</>;
  }

  // Se não está autenticado, não renderizar nada (já redirecionou acima)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Redirecionando para login...
          </p>
        </div>
      </div>
    );
  }

  // Autenticado e não é rota pública, renderizar normalmente
  return <>{children}</>;
}



