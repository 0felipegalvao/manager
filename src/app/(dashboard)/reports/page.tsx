'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, Users, FileText, Calendar } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth, usePermissions } from '@/contexts/AuthContext';
import { useApi } from '@/hooks/useApi';
import { reportsApi } from '@/lib/api';
import { LoadingCard } from '@/components/ui/loading';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

function ReportsContent() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const { isAdmin, isContador } = usePermissions();

  const { data: dashboardStats, loading: loadingStats } = useApi(() => reportsApi.getDashboardStats(), []);
  const { data: clientsByStatus } = useApi(() => reportsApi.getClientsByStatus(), []);
  const { data: clientsByTaxRegime } = useApi(() => reportsApi.getClientsByTaxRegime(), []);
  const { data: monthlyStats } = useApi(() => reportsApi.getMonthlyStats(parseInt(selectedYear)), [selectedYear]);
  const { data: topClients } = useApi(() => reportsApi.getTopClients(5), []);
  const { data: revenueReport } = useApi(() => 
    isContador() ? reportsApi.getRevenueReport(parseInt(selectedYear)) : Promise.resolve(null), 
    [selectedYear, isContador]
  );

  if (loadingStats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <LoadingCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios e Analytics</h1>
          <p className="text-gray-600">Análise detalhada do desempenho do escritório</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats?.clients?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{dashboardStats?.clients?.active || 0} ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documentos Processados</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats?.documents?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total de documentos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Obrigações Pendentes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats?.obligations?.pending || 0}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats?.obligations?.overdue || 0} vencidas
            </p>
          </CardContent>
        </Card>

        {isContador() && revenueReport && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Anual</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(revenueReport.totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                Média mensal: {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(revenueReport.averageRevenue)}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Clients by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Clientes por Status</CardTitle>
            <CardDescription>
              Visualização do status atual dos clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={clientsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, count }) => `${status}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {clientsByStatus?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Clients by Tax Regime */}
        <Card>
          <CardHeader>
            <CardTitle>Clientes por Regime Tributário</CardTitle>
            <CardDescription>
              Distribuição dos regimes tributários
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={clientsByTaxRegime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="regime" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Mensal - {selectedYear}</CardTitle>
          <CardDescription>
            Evolução mensal de clientes, documentos e obrigações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="monthName" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="clients" 
                stroke="#8884d8" 
                strokeWidth={2}
                name="Clientes"
              />
              <Line 
                type="monotone" 
                dataKey="documents" 
                stroke="#82ca9d" 
                strokeWidth={2}
                name="Documentos"
              />
              <Line 
                type="monotone" 
                dataKey="obligations" 
                stroke="#ffc658" 
                strokeWidth={2}
                name="Obrigações"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Clients */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Clientes</CardTitle>
            <CardDescription>
              Clientes com maior atividade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topClients?.map((client: any, index: number) => (
                <div key={client.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{client.razaoSocial}</div>
                      <div className="text-sm text-gray-500">{client.cnpj}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{client.totalActivity}</div>
                    <div className="text-sm text-gray-500">atividades</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Chart - Only for Admin/Contador */}
        {isContador() && revenueReport && (
          <Card>
            <CardHeader>
              <CardTitle>Receita Mensal - {selectedYear}</CardTitle>
              <CardDescription>
                Evolução da receita ao longo do ano
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueReport.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="monthName" />
                  <YAxis 
                    tickFormatter={(value) => 
                      new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        minimumFractionDigits: 0
                      }).format(value)
                    }
                  />
                  <Tooltip 
                    formatter={(value) => [
                      new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(Number(value)),
                      'Receita'
                    ]}
                  />
                  <Bar dataKey="revenue" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function ReportsPage() {
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
                <BreadcrumbPage>Relatórios</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <ReportsContent />
      </div>
    </>
  );
}
