'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserForm } from '@/components/users/user-form';
import { usePermissions } from '@/contexts/AuthContext';
import { useApi } from '@/hooks/useApi';
import { toast } from 'sonner';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'CONTADOR' | 'ASSISTENTE';
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EditUserPageProps {
  params: {
    id: string;
  };
}

export default function EditUserPage({ params }: EditUserPageProps) {
  const router = useRouter();
  const { isAdmin } = usePermissions();
  const userId = parseInt(params.id);

  // Buscar dados do usuário
  const { data: user, loading, error } = useApi<User>(
    () => fetch(`/api/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    }).then(res => {
      if (!res.ok) throw new Error('Usuário não encontrado');
      return res.json();
    }),
    [userId]
  );

  // Verificar permissões
  if (!isAdmin()) {
    return (
      <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h3 className="mt-4 text-lg font-semibold">Acesso Negado</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            Você não tem permissão para acessar esta página.
          </p>
          <Button onClick={() => router.push('/users')}>
            Voltar para Usuários
          </Button>
        </div>
      </div>
    );
  }

  const handleSuccess = () => {
    toast.success('Usuário atualizado com sucesso!');
    router.push('/users');
  };

  const handleError = (error: string) => {
    toast.error(error);
  };

  if (loading) {
    return (
      <>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/users">Usuários</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Carregando...</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-4 text-sm text-muted-foreground">Carregando dados do usuário...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !user) {
    return (
      <>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/users">Usuários</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Erro</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <h3 className="mt-4 text-lg font-semibold">Erro ao carregar</h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                {error || 'Usuário não encontrado'}
              </p>
              <Button onClick={() => router.push('/users')}>
                Voltar para Usuários
              </Button>
            </div>
          </div>
        </div>
      </>
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
                <BreadcrumbLink href="/users">Usuários</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Editar {user.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Editar Usuário</h1>
            <p className="text-muted-foreground">
              Atualize os dados do usuário {user.name}
            </p>
          </div>
        </div>

        <UserForm
          user={user}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>
    </>
  );
}
