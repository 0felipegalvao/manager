'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, CheckCircle, Clock, AlertTriangle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useApi, useMutation } from '@/hooks/useApi';
import { toast } from 'sonner';

interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA';
  priority: number;
  dueDate: string;
  completedAt?: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  client?: {
    id: number;
    razaoSocial: string;
    cnpj: string;
  };
  obligation?: {
    id: number;
    name: string;
    type: string;
    dueDate: string;
  };
}

export default function TasksPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // API calls
  const { data: tasks, loading, error, refetch } = useApi<Task[]>(
    () => fetch('/api/tasks', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    }).then(res => res.json()),
    []
  );

  const { mutate: deleteTask, loading: deleting } = useMutation<void, number>(
    (id) => fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    }).then(res => {
      if (!res.ok) throw new Error('Erro ao deletar tarefa');
      return res.json();
    })
  );

  const { mutate: completeTask, loading: completing } = useMutation<void, number>(
    (id) => fetch(`/api/tasks/${id}/complete`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    }).then(res => {
      if (!res.ok) throw new Error('Erro ao completar tarefa');
      return res.json();
    })
  );

  // Filtrar tarefas
  const filteredTasks = tasks?.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.client?.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority.toString() === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  }) || [];

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;

    const result = await deleteTask(taskToDelete.id);
    if (result) {
      toast.success('Tarefa removida com sucesso');
      refetch();
      setTaskToDelete(null);
    }
  };

  const handleCompleteTask = async (task: Task) => {
    const result = await completeTask(task.id);
    if (result) {
      toast.success('Tarefa marcada como concluída');
      refetch();
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
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
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: number) => {
    const config = {
      1: { label: 'Baixa', variant: 'secondary' as const },
      2: { label: 'Média', variant: 'default' as const },
      3: { label: 'Alta', variant: 'destructive' as const },
    };

    const { label, variant } = config[priority as keyof typeof config] || config[1];

    return <Badge variant={variant}>{label}</Badge>;
  };

  const isOverdue = (dueDate: string, status: string) => {
    return new Date(dueDate) < new Date() && status !== 'CONCLUIDA' && status !== 'CANCELADA';
  };

  if (loading) {
    return (
      <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-sm text-muted-foreground">Carregando tarefas...</p>
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
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Tarefas</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tarefas</h1>
            <p className="text-muted-foreground">
              Gerencie as tarefas e atividades
            </p>
          </div>
          <Button onClick={() => router.push('/tasks/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Tarefa
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Tarefas</CardTitle>
            <CardDescription>
              {filteredTasks.length} tarefa(s) encontrada(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título, descrição ou cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
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
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as prioridades</SelectItem>
                  <SelectItem value="1">Baixa</SelectItem>
                  <SelectItem value="2">Média</SelectItem>
                  <SelectItem value="3">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarefa</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {task.title}
                            {isOverdue(task.dueDate, task.status) && (
                              <AlertTriangle className="h-4 w-4 text-destructive" />
                            )}
                          </div>
                          {task.description && (
                            <div className="text-sm text-muted-foreground">
                              {task.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {task.client ? (
                          <div>
                            <div className="font-medium">{task.client.razaoSocial}</div>
                            <div className="text-sm text-muted-foreground">{task.client.cnpj}</div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(task.status)}</TableCell>
                      <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className={isOverdue(task.dueDate, task.status) ? 'text-destructive' : ''}>
                            {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{task.user.name}</div>
                          <div className="text-sm text-muted-foreground">{task.user.email}</div>
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
                              onClick={() => router.push(`/tasks/${task.id}`)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            {task.status !== 'CONCLUIDA' && task.status !== 'CANCELADA' && (
                              <DropdownMenuItem
                                onClick={() => handleCompleteTask(task)}
                                disabled={completing}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Marcar como Concluída
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setTaskToDelete(task)}
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

            {filteredTasks.length === 0 && (
              <div className="flex h-[200px] items-center justify-center">
                <div className="text-center">
                  <h3 className="text-lg font-semibold">Nenhuma tarefa encontrada</h3>
                  <p className="text-sm text-muted-foreground">
                    Tente ajustar os filtros ou criar uma nova tarefa.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!taskToDelete} onOpenChange={() => setTaskToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a tarefa "{taskToDelete?.title}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTask}
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
