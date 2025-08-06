'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, TrendingUp, FileText, Calendar, DollarSign, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

// Dados mock para os gráficos
const monthlyTaxData = [
  { month: 'Jan', icms: 15000, ipi: 8000, pis: 3000, cofins: 12000 },
  { month: 'Fev', icms: 18000, ipi: 9500, pis: 3500, cofins: 14000 },
  { month: 'Mar', icms: 22000, ipi: 11000, pis: 4000, cofins: 16000 },
  { month: 'Abr', icms: 19000, ipi: 10000, pis: 3800, cofins: 15000 },
  { month: 'Mai', icms: 25000, ipi: 12500, pis: 4500, cofins: 18000 },
  { month: 'Jun', icms: 28000, ipi: 14000, pis: 5000, cofins: 20000 },
];

const taxTypeData = [
  { name: 'ICMS', value: 127000, color: '#0088FE' },
  { name: 'IPI', value: 65000, color: '#00C49F' },
  { name: 'PIS', value: 24300, color: '#FFBB28' },
  { name: 'COFINS', value: 95000, color: '#FF8042' },
];

const obligationsData = [
  { month: 'Jan', completed: 45, pending: 5, overdue: 2 },
  { month: 'Fev', completed: 48, pending: 3, overdue: 1 },
  { month: 'Mar', completed: 52, pending: 4, overdue: 0 },
  { month: 'Abr', completed: 47, pending: 6, overdue: 3 },
  { month: 'Mai', completed: 55, pending: 2, overdue: 1 },
  { month: 'Jun', completed: 58, pending: 4, overdue: 0 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function FiscalReportsPage() {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const totalTaxes = taxTypeData.reduce((acc, item) => acc + item.value, 0);
  const completedObligations = obligationsData.reduce((acc, item) => acc + item.completed, 0);
  const totalObligations = obligationsData.reduce((acc, item) => acc + item.completed + item.pending + item.overdue, 0);

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
                <BreadcrumbLink href="/fiscal">Fiscal</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Relatórios Fiscais</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Header com controles */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Relatórios Fiscais</h1>
            <p className="text-muted-foreground">
              Análise detalhada de impostos, obrigações e performance fiscal
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Mensal</SelectItem>
                <SelectItem value="quarterly">Trimestral</SelectItem>
                <SelectItem value="yearly">Anual</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Métricas principais */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Impostos</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {totalTaxes.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> vs mês anterior
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Obrigações Cumpridas</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedObligations}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((completedObligations / totalObligations) * 100)}% de eficiência
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Maior Imposto</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">ICMS</div>
              <p className="text-xs text-muted-foreground">
                R$ {taxTypeData[0].value.toLocaleString('pt-BR')}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Relatórios Gerados</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                Este mês
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Gráfico de impostos mensais */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução dos Impostos</CardTitle>
              <CardDescription>
                Comparativo mensal dos principais impostos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyTaxData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any) => [`R$ ${value.toLocaleString('pt-BR')}`, '']}
                  />
                  <Bar dataKey="icms" fill="#0088FE" name="ICMS" />
                  <Bar dataKey="ipi" fill="#00C49F" name="IPI" />
                  <Bar dataKey="pis" fill="#FFBB28" name="PIS" />
                  <Bar dataKey="cofins" fill="#FF8042" name="COFINS" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de distribuição de impostos */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Tipo de Imposto</CardTitle>
              <CardDescription>
                Participação de cada imposto no total arrecadado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={taxTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {taxTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`R$ ${value.toLocaleString('pt-BR')}`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de obrigações */}
        <Card>
          <CardHeader>
            <CardTitle>Performance das Obrigações Fiscais</CardTitle>
            <CardDescription>
              Acompanhamento do cumprimento das obrigações ao longo do tempo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={obligationsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#00C49F" 
                  strokeWidth={2}
                  name="Concluídas"
                />
                <Line 
                  type="monotone" 
                  dataKey="pending" 
                  stroke="#FFBB28" 
                  strokeWidth={2}
                  name="Pendentes"
                />
                <Line 
                  type="monotone" 
                  dataKey="overdue" 
                  stroke="#FF8042" 
                  strokeWidth={2}
                  name="Vencidas"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Resumo de relatórios disponíveis */}
        <Card>
          <CardHeader>
            <CardTitle>Relatórios Disponíveis</CardTitle>
            <CardDescription>
              Relatórios fiscais que podem ser gerados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <h3 className="font-medium">SPED Fiscal</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Arquivo digital para escrituração fiscal
                </p>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Gerar
                </Button>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Calculator className="h-5 w-5 text-green-500" />
                  <h3 className="font-medium">DCTF</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Declaração de Débitos e Créditos Tributários
                </p>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Gerar
                </Button>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <h3 className="font-medium">Análise Tributária</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Relatório detalhado de carga tributária
                </p>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Gerar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
