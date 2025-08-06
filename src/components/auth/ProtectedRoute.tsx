'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, usePermissions } from '@/contexts/AuthContext';
import { LoadingPage } from '@/components/ui/loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  fallbackPath?: string;
}

export function ProtectedRoute({
  children,
  requiredRoles = [],
  fallbackPath = '/login'
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { hasRole } = usePermissions();
  const router = useRouter();

  // Fallback: se o middleware não redirecionar, fazer no cliente
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('🔄 ProtectedRoute: Forçando redirecionamento para', fallbackPath);
      router.replace(fallbackPath);
    }
  }, [isAuthenticated, isLoading, router, fallbackPath]);

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return <LoadingPage />;
  }

  // Se não está autenticado, não renderizar nada (vai redirecionar)
  if (!isAuthenticated) {
    return <LoadingPage />;
  }

  // Se tem roles requeridos e não tem permissão, não renderizar nada (vai redirecionar)
  if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
    return <LoadingPage />;
  }

  // Se passou por todas as verificações, renderizar o conteúdo
  return <>{children}</>;
}

// HOC para facilitar o uso
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles?: string[]
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute requiredRoles={requiredRoles}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}
