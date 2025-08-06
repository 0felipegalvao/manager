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
import { toast } from 'sonner';

export default function NewUserPage() {
  const router = useRouter();
  const { isAdmin } = usePermissions();

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
    toast.success('Usuário criado com sucesso!');
    router.push('/users');
  };

  const handleError = (error: string) => {
    toast.error(error);
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
                <BreadcrumbLink href="/users">Usuários</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Novo Usuário</BreadcrumbPage>
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
            <h1 className="text-3xl font-bold tracking-tight">Novo Usuário</h1>
            <p className="text-muted-foreground">
              Preencha os dados para criar um novo usuário
            </p>
          </div>
        </div>

        <UserForm
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>
    </>
  );
}
