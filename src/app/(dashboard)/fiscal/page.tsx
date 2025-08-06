'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, ChevronLeft, ChevronRight, Plus, AlertTriangle, Clock, CheckCircle, Search, Filter, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useApi, useMutation } from '@/hooks/useApi';
import { toast } from 'sonner';

interface Obligation {
  id: number;
  name: string;
  type: string;
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA';
  dueDate: string;
  completedAt?: string;
  createdAt: string;
  client: {
    id: number;
    razaoSocial: string;
    cnpj: string;
  };
}

export default function FiscalPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [obligationToDelete, setObligationToDelete] = useState<Obligation | null>(null);

  // API calls
  const { data: obligations, loading, error, refetch } = useApi<Obligation[]>(
    () => fetch('/api/fiscal', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    }).then(res => res.json()),
    []
  );

  const { mutate: deleteObligation, loading: deleting } = useMutation<void, number>(
    (id) => fetch(`/api/fiscal/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    }).then(res => {
      if (!res.ok) throw new Error('Erro ao deletar obrigação');
      return res.json();
    })
  );

  // Filtrar obrigações
  const filteredObligations = obligations?.filter(obligation => {
    const matchesSearch = obligation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         obligation.client.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || obligation.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || obligation.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  }) || [];

  const handleDeleteObligation = async () => {
    if (!obligationToDelete) return;

    const result = await deleteObligation(obligationToDelete.id);
    if (result) {
      toast.success('Obrigação removida com sucesso');
      refetch();
      setObligationToDelete(null);
    }
  };

  const getStatusBadge = (status: string, dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const isOverdue = due < now && status !== 'CONCLUIDA';

    if (isOverdue) {
      return <Badge variant="destructive">Vencida</Badge>;
    }

    const statusVariants = {
      PENDENTE: 'secondary',
      EM_ANDAMENTO: 'default',
      CONCLUIDA: 'default',
      CANCELADA: 'destructive',
    } as const;

    const labels = {
      PENDENTE: 'Pendente',
      EM_ANDAMENTO: 'Em Andamento',
      CONCLUIDA: 'Concluída',
      CANCELADA: 'Cancelada',
    };

    return (
      <Badge variant={statusVariants[status as keyof typeof statusVariants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const isOverdue = (dueDate: string, status: string) => {
    return new Date(dueDate) < new Date() && status !== 'CONCLUIDA' && status !== 'CANCELADA';
  };

  if (loading) {
    return (
      <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-sm text-muted-foreground">Carregando obrigações fiscais...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h3 className="mt-4 text-lg font-semibold">Erro ao carregar</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">{error}</p>
          <Button onClick={refetch}>Tentar novamente</Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Obrigações Fiscais</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Obrigações Fiscais</h1>
            <p className="text-muted-foreground">
              Gerencie as obrigações fiscais dos clientes
            </p>
          </div>
          <Button onClick={() => router.push('/fiscal/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Obrigação
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Obrigações</CardTitle>
            <CardDescription>
              {filteredObligations.length} obrigação(ões) encontrada(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="MENSAL">Mensal</SelectItem>
                  <SelectItem value="TRIMESTRAL">Trimestral</SelectItem>
                  <SelectItem value="ANUAL">Anual</SelectItem>
                  <SelectItem value="EVENTUAL">Eventual</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="PENDENTE">Pendente</SelectItem>
                  <SelectItem value="EM_ANDAMENTO">Em Andamento</SelectItem>
                  <SelectItem value="CONCLUIDA">Concluída</SelectItem>
                  <SelectItem value="CANCELADA">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Obrigação</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredObligations.map((obligation) => (
                    <TableRow key={obligation.id}>
                      <TableCell>
                        <div className="font-medium flex items-center gap-2">
                          {obligation.name}
                          {isOverdue(obligation.dueDate, obligation.status) && (
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{obligation.client.razaoSocial}</div>
                          <div className="text-sm text-muted-foreground">{obligation.client.cnpj}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{obligation.type}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(obligation.status, obligation.dueDate)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className={isOverdue(obligation.dueDate, obligation.status) ? 'text-destructive' : ''}>
                            {new Date(obligation.dueDate).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => router.push(`/fiscal/${obligation.id}`)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setObligationToDelete(obligation)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredObligations.length === 0 && (
              <div className="flex h-[200px] items-center justify-center">
                <div className="text-center">
                  <h3 className="text-lg font-semibold">Nenhuma obrigação encontrada</h3>
                  <p className="text-sm text-muted-foreground">
                    Tente ajustar os filtros ou criar uma nova obrigação.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!obligationToDelete} onOpenChange={() => setObligationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a obrigação "{obligationToDelete?.name}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteObligation}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
