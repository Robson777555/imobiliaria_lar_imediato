import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { checkAuth } from '@/utils/auth';
import { Loader2 } from 'lucide-react';
import SimpleLogin from '@/pages/SimpleLogin';

interface SimpleAuthGuardProps {
  children: React.ReactNode;
}

export default function SimpleAuthGuard({ children }: SimpleAuthGuardProps) {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const publicPaths = ['/login', '/politica-privacidade', '/termos-servico'];
  const isPublicPath = publicPaths.includes(currentPath);

  useEffect(() => {
    if (isPublicPath) {
      setLoading(false);
      setIsAuthenticated(true); // Permitir acesso a rotas públicas
      return;
    }

    // Verificar autenticação
    const verifyAuth = async () => {
      try {
        const authenticated = await checkAuth();
        setIsAuthenticated(authenticated);
        setLoading(false);

        if (!authenticated && currentPath !== '/login') {
          // Redirecionar para login se não estiver autenticado
          const returnTo = encodeURIComponent(currentPath + window.location.search);
          window.location.replace(`/login?returnTo=${returnTo}`);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setLoading(false);
        if (currentPath !== '/login') {
          window.location.replace('/login');
        }
      }
    };

    verifyAuth();
  }, [currentPath, isPublicPath]);

  // Mostrar loading enquanto verifica
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

  // Se é rota pública, permitir acesso
  if (isPublicPath) {
    return <>{children}</>;
  }

  // Se não está autenticado, mostrar login
  if (!isAuthenticated) {
    return <SimpleLogin />;
  }

  // Autenticado, renderizar normalmente
  return <>{children}</>;
}

