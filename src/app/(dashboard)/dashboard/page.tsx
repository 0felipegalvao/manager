'use client';

import { Building2, FileText, AlertTriangle, TrendingUp, Users, Calendar, DollarSign, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

// Dados mock para o dashboard
const dashboardData = {
  metrics: {
    totalClients: 156,
    activeClients: 142,
    totalDocuments: 1247,
    pendingObligations: 8,
    monthlyRevenue: 45600,
    completedTasks: 89
  },
  recentActivities: [
    {
      id: 1,
      type: 'client',
      description: 'Novo cliente cadastrado: Tech Solutions S.A.',
      time: '2 horas atrás',
      status: 'success'
    },
    {
      id: 2,
      type: 'document',
      description: 'Documento aprovado: Balanço Patrimonial - Empresa ABC',
      time: '4 horas atrás',
      status: 'success'
    },
    {
      id: 3,
      type: 'obligation',
      description: 'Obrigação vencendo: DARF - João Silva',
      time: '6 horas atrás',
      status: 'warning'
    },
    {
      id: 4,
      type: 'notification',
      description: 'Lembrete: Reunião com cliente às 14h',
      time: '1 dia atrás',
      status: 'info'
    }
  ],
  upcomingObligations: [
    {
      id: 1,
      client: 'Empresa ABC Ltda',
      obligation: 'DARF - Imposto de Renda',
      dueDate: '2024-01-20',
      status: 'Pendente',
      priority: 'Alta'
    },
    {
      id: 2,
      client: 'Tech Solutions S.A.',
      obligation: 'GFIP - Guia do FGTS',
      dueDate: '2024-01-22',
      status: 'Em Andamento',
      priority: 'Média'
    },
    {
      id: 3,
      client: 'João Silva',
      obligation: 'IRPF - Declaração',
      dueDate: '2024-01-25',
      status: 'Pendente',
      priority: 'Baixa'
    }
  ]
};

export default function DashboardPage() {
  const { metrics, recentActivities, upcomingObligations } = dashboardData;

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Métricas principais */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalClients}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documentos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalDocuments}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+23</span> novos esta semana
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Obrigações Pendentes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.pendingObligations}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-600">3 vencendo</span> esta semana
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {metrics.monthlyRevenue.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8%</span> em relação ao mês anterior
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Atividades recentes */}
          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
              <CardDescription>
                Últimas atividades do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.status === 'success' ? 'bg-green-500' :
                      activity.status === 'warning' ? 'bg-yellow-500' :
                      activity.status === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                    }`} />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Ver todas as atividades
              </Button>
            </CardContent>
          </Card>

          {/* Obrigações próximas */}
          <Card>
            <CardHeader>
              <CardTitle>Próximas Obrigações</CardTitle>
              <CardDescription>
                Obrigações fiscais com vencimento próximo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingObligations.map((obligation) => (
                  <div key={obligation.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{obligation.obligation}</p>
                      <p className="text-xs text-muted-foreground">{obligation.client}</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span className="text-xs">
                          {new Date(obligation.dueDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge
                        variant={
                          obligation.status === 'Em Andamento' ? 'default' : 'secondary'
                        }
                        className="text-xs"
                      >
                        {obligation.status}
                      </Badge>
                      <div className="text-xs">
                        <Badge
                          variant={
                            obligation.priority === 'Alta' ? 'destructive' :
                            obligation.priority === 'Média' ? 'default' : 'secondary'
                          }
                        >
                          {obligation.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Ver todas as obrigações
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Resumo de performance */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo de Performance</CardTitle>
            <CardDescription>
              Indicadores de performance do escritório
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">{metrics.completedTasks}%</div>
                <p className="text-sm text-muted-foreground">Tarefas Concluídas</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{metrics.activeClients}</div>
                <p className="text-sm text-muted-foreground">Clientes Ativos</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">98%</div>
                <p className="text-sm text-muted-foreground">Satisfação do Cliente</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
