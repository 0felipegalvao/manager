'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

interface BreadcrumbItem {
  title: string;
  href?: string;
}

const routeMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/clients': 'Clientes',
  '/clients/new': 'Novo Cliente',
  '/documents': 'Documentos',
  '/fiscal': 'Obrigações Fiscais',
  '/fiscal/upcoming': 'Próximas Obrigações',
  '/fiscal/overdue': 'Obrigações Vencidas',
  '/fiscal/history': 'Histórico Fiscal',
  '/notifications': 'Notificações',
  '/reports': 'Relatórios',
  '/reports/financial': 'Relatórios Financeiros',
  '/reports/operational': 'Relatórios Operacionais',
  '/reports/fiscal': 'Relatórios Fiscais',
  '/reports/custom': 'Relatórios Customizados',
  '/users': 'Usuários',
  '/settings': 'Configurações',
  '/settings/system': 'Configurações do Sistema',
  '/settings/fiscal': 'Configurações Fiscais',
  '/settings/integrations': 'Integrações',
};

export function useBreadcrumbs(): BreadcrumbItem[] {
  const pathname = usePathname();

  return useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Always start with Dashboard
    if (pathname !== '/dashboard') {
      breadcrumbs.push({
        title: 'Dashboard',
        href: '/dashboard',
      });
    }

    // Build breadcrumbs from path segments
    let currentPath = '';
    
    for (let i = 0; i < segments.length; i++) {
      currentPath += `/${segments[i]}`;
      
      // Skip if this is the last segment (current page)
      const isLast = i === segments.length - 1;
      
      // Get title from route map or format segment
      let title = routeMap[currentPath];
      
      if (!title) {
        // Handle dynamic routes like /clients/123
        if (segments[i].match(/^\d+$/)) {
          // If it's a number, it's likely an ID
          const parentPath = segments.slice(0, i).join('/');
          const parentTitle = routeMap[`/${parentPath}`];
          if (parentTitle) {
            title = `${parentTitle} #${segments[i]}`;
          } else {
            title = `Item #${segments[i]}`;
          }
        } else {
          // Format segment as title
          title = segments[i]
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        }
      }

      breadcrumbs.push({
        title,
        href: isLast ? undefined : currentPath,
      });
    }

    return breadcrumbs;
  }, [pathname]);
}

// Hook to get current page title
export function usePageTitle(): string {
  const pathname = usePathname();
  
  return useMemo(() => {
    return routeMap[pathname] || 'Página';
  }, [pathname]);
}
