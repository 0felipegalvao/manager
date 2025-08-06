import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  Calendar,
  Bell,
  BarChart3,
  Settings,
} from 'lucide-react';
import { NavigationData, NavigationGroup } from '@/types/navigation';

export const navigationData: NavigationData = {
  groups: [
    {
      title: "Principal",
      items: [
        {
          title: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
          roles: ['ADMIN', 'CONTADOR', 'ASSISTENTE'],
        },
      ],
    },
    {
      title: "Gestão",
      items: [
        {
          title: "Clientes",
          icon: Building2,
          roles: ['ADMIN', 'CONTADOR', 'ASSISTENTE'],
          items: [
            { title: "Todos os Clientes", href: "/clients" },
            { title: "Clientes Ativos", href: "/clients?status=active" },
            { title: "Clientes Inativos", href: "/clients?status=inactive" },
            { title: "Novo Cliente", href: "/clients/new" },
          ],
        },
        {
          title: "Documentos",
          icon: FileText,
          roles: ['ADMIN', 'CONTADOR', 'ASSISTENTE'],
          items: [
            { title: "Todos os Documentos", href: "/documents" },
            { title: "Pendentes", href: "/documents?status=pending", badge: "3" },
            { title: "Em Análise", href: "/documents?status=reviewing" },
            { title: "Aprovados", href: "/documents?status=approved" },
            { title: "Rejeitados", href: "/documents?status=rejected" },
          ],
        },
      ],
    },
    {
      title: "Fiscal",
      items: [
        {
          title: "Obrigações Fiscais",
          icon: Calendar,
          roles: ['ADMIN', 'CONTADOR', 'ASSISTENTE'],
          items: [
            { title: "Calendário Fiscal", href: "/fiscal" },
            { title: "Próximas Obrigações", href: "/fiscal/upcoming", badge: "5" },
            { title: "Obrigações Vencidas", href: "/fiscal/overdue", badge: "2" },
            { title: "Histórico", href: "/fiscal/history" },
          ],
        },
        {
          title: "Notificações",
          href: "/notifications",
          icon: Bell,
          roles: ['ADMIN', 'CONTADOR', 'ASSISTENTE'],
          badge: "7",
        },
      ],
    },
    {
      title: "Relatórios",
      items: [
        {
          title: "Relatórios",
          icon: BarChart3,
          roles: ['ADMIN', 'CONTADOR'],
          items: [
            { title: "Dashboard de Relatórios", href: "/reports" },
            { title: "Relatórios Financeiros", href: "/reports/financial" },
            { title: "Relatórios Operacionais", href: "/reports/operational" },
            { title: "Relatórios Fiscais", href: "/reports/fiscal" },
            { title: "Relatórios Customizados", href: "/reports/custom" },
          ],
        },
      ],
    },
    {
      title: "Administração",
      items: [
        {
          title: "Usuários",
          href: "/users",
          icon: Users,
          roles: ['ADMIN'],
        },
        {
          title: "Configurações",
          icon: Settings,
          roles: ['ADMIN', 'CONTADOR'],
          items: [
            { title: "Configurações Gerais", href: "/settings" },
            { title: "Configurações do Sistema", href: "/settings/system" },
            { title: "Configurações Fiscais", href: "/settings/fiscal" },
            { title: "Integrações", href: "/settings/integrations" },
          ],
        },
      ],
    },
  ],
};

// Função para filtrar navegação baseada em permissões
export function getFilteredNavigation(hasRole: (roles: string[]) => boolean): NavigationGroup[] {
  return navigationData.groups
    .map(group => ({
      ...group,
      items: group.items.filter(item => hasRole(item.roles))
    }))
    .filter(group => group.items.length > 0);
}

// Função para encontrar item ativo baseado no pathname
export function getActiveNavigationItem(pathname: string, groups: NavigationGroup[]) {
  for (const group of groups) {
    for (const item of group.items) {
      if (item.href && (pathname === item.href || pathname.startsWith(item.href + '/'))) {
        return { group: group.title, item: item.title };
      }
      
      if (item.items) {
        for (const subItem of item.items) {
          if (pathname === subItem.href || pathname.startsWith(subItem.href + '/')) {
            return { group: group.title, item: item.title, subItem: subItem.title };
          }
        }
      }
    }
  }
  
  return null;
}
