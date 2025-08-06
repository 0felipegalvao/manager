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
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ClientForm } from '@/components/clients/client-form';
import { toast } from 'sonner';

export default function NewClientPage() {
  const router = useRouter();

  const handleCreateClient = async (data: any) => {
    try {
      // Mapear dados do frontend para o formato do backend
      const clientData = {
        razaoSocial: data.razaoSocial,
        nomeFantasia: data.nomeFantasia || undefined,
        cnpj: data.documento.replace(/\D/g, ''), // Remove formatação
        inscricaoEstadual: data.inscricaoEstadual || undefined,
        inscricaoMunicipal: data.inscricaoMunicipal || undefined,
        taxRegime: data.regimeTributario,
        status: data.status || 'ATIVO',
        endereco: data.logradouro,
        numero: data.numero,
        complemento: data.complemento || undefined,
        bairro: data.bairro,
        cidade: data.cidade,
        estado: data.estado,
        cep: data.cep.replace(/\D/g, ''), // Remove formatação
        telefone: data.telefone || undefined,
        celular: undefined,
        email: data.email || undefined,
        emailContador: undefined,
        dataAbertura: undefined,
        capitalSocial: undefined,
        atividadePrincipal: undefined,
        dataVencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        valorMensal: undefined,
        observacoes: undefined,
      };

      const { clientsApi } = await import('@/lib/api');
      await clientsApi.create(clientData);

      toast.success('Cliente criado com sucesso!');
      router.push('/clients');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao criar cliente';
      toast.error(errorMessage);
      console.error('Erro:', error);
    }
  };

  const handleCancel = () => {
    router.push('/clients');
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/clients">Clientes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Novo Cliente</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 max-w-none">
        {/* Header da página */}
        <div className="flex items-center gap-4 mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Novo Cliente</h1>
            <p className="text-muted-foreground">
              Preencha as informações para cadastrar um novo cliente
            </p>
          </div>
        </div>

        {/* Formulário */}
        <div className="w-full flex-1">
          <ClientForm
            onSubmit={handleCreateClient}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </>
  );
}
