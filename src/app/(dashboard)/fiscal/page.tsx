'use client';

import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useApi } from '@/hooks/useApi';
import { fiscalApi, clientsApi } from '@/lib/api';
import { LoadingCard } from '@/components/ui/loading';

function FiscalContent() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedClient, setSelectedClient] = useState<string>('');

  const { data: obligations, loading } = useApi(() => fiscalApi.getObligations(), []);
  const { data: clients } = useApi(() => clientsApi.getAll(), []);
  const { data: upcomingObligations } = useApi(() => fiscalApi.getUpcomingObligations(30), []);
  const { data: overdueObligations } = useApi(() => fiscalApi.getOverdueObligations(), []);

  const filteredObligations = obligations?.filter((obligation: any) => {
    return selectedClient === 'all' || !selectedClient || obligation.clientId.toString() === selectedClient;
  }) || [];

  const getStatusBadge = (status: string, dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const isOverdue = due < now && status !== 'CONCLUIDA';

    if (isOverdue) {
      return <Badge variant="destructive">Vencida</Badge>;
    }

    const colors = {
      PENDENTE: 'bg-yellow-100 text-yellow-800',
      EM_ANDAMENTO: 'bg-blue-100 text-blue-800',
      CONCLUIDA: 'bg-green-100 text-green-800',
      CANCELADA: 'bg-red-100 text-red-800',
    } as const;

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyIcon = (dueDate: string, status: string) => {
    const daysUntil = getDaysUntilDue(dueDate);
    
    if (status === 'CONCLUIDA') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    
    if (daysUntil < 0) {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
    
    if (daysUntil <= 7) {
      return <Clock className="h-4 w-4 text-yellow-500" />;
    }
    
    return <Calendar className="h-4 w-4 text-blue-500" />;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  if (loading) {
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
          <h1 className="text-3xl font-bold text-gray-900">Calendário Fiscal</h1>
          <p className="text-gray-600">Gerencie obrigações fiscais e prazos</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Obrigação
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Obrigações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{obligations?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Próximas (30 dias)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {upcomingObligations?.length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {overdueObligations?.length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {obligations?.filter((o: any) => o.status === 'CONCLUIDA').length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>
                Visualização mensal das obrigações fiscais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Grid - Simplified for demo */}
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 6; // Adjust for month start
                  const isCurrentMonth = day > 0 && day <= 31;
                  const hasObligations = isCurrentMonth && Math.random() > 0.8; // Demo data
                  
                  return (
                    <div
                      key={i}
                      className={`
                        p-2 min-h-[60px] border rounded-md
                        ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'}
                        ${hasObligations ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}
                      `}
                    >
                      {isCurrentMonth && (
                        <>
                          <div className="text-sm font-medium">{day}</div>
                          {hasObligations && (
                            <div className="mt-1">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Obligations */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Próximas Obrigações</CardTitle>
              <CardDescription>
                Obrigações com vencimento próximo
              </CardDescription>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os clientes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os clientes</SelectItem>
                  {clients?.map((client: any) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.razaoSocial}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredObligations.slice(0, 10).map((obligation: any) => (
                  <div key={obligation.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    {getUrgencyIcon(obligation.dueDate, obligation.status)}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{obligation.name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {clients?.find((c: any) => c.id === obligation.clientId)?.razaoSocial}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs text-gray-500">
                          Vence: {new Date(obligation.dueDate).toLocaleDateString('pt-BR')}
                        </div>
                        {getStatusBadge(obligation.status, obligation.dueDate)}
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredObligations.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhuma obrigação encontrada
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function FiscalPage() {
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
                <BreadcrumbPage>Fiscal</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <FiscalContent />
      </div>
    </>
  );
}
