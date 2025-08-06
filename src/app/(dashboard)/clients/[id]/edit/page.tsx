'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
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



export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const { clientsApi } = await import('@/lib/api');
        const clientData = await clientsApi.getById(Number(params.id));

        // Mapear dados do backend para o formato do frontend (nova estrutura)
        const mappedClient = {
          // Dados Básicos
          razaoSocial: clientData.razaoSocial,
          nomeFantasia: clientData.nomeFantasia || '',
          cnpj: clientData.cnpj,
          cpf: clientData.cpf || '',
          inscricaoEstadual: clientData.inscricaoEstadual || '',
          inscricaoMunicipal: clientData.inscricaoMunicipal || '',

          // Endereço e Contato
          cep: clientData.cep,
          endereco: clientData.endereco,
          numero: clientData.numero,
          complemento: clientData.complemento || '',
          bairro: clientData.bairro,
          cidade: clientData.cidade,
          estado: clientData.estado,
          telefone: clientData.telefone || '',
          celular: clientData.celular || '',
          email: clientData.email || '',
          emailContador: clientData.emailContador || '',

          // Situação Cadastral
          status: clientData.status,
          dataAbertura: clientData.dataAbertura || '',
          dataSituacao: clientData.dataSituacao || '',
          inicioAtividade: clientData.inicioAtividade || '',
          inicioEscritorio: clientData.inicioEscritorio || '',

          // Simples Nacional
          codigoSimples: clientData.codigoSimples || '',
          porte: clientData.porte || '',
          porcPJEcac: clientData.porcPJEcac || '',
          procPFEcac: clientData.procPFEcac || '',

          // Departamento
          departmentId: clientData.departmentId || null,

          // Dados Financeiros
          capitalSocial: clientData.capitalSocial || 0,
          valorMensal: clientData.valorMensal || 0,
          dataVencimento: clientData.dataVencimento || '',

          // Atividade
          atividadePrincipal: clientData.atividadePrincipal || '',

          // Observações
          observacoes: clientData.observacoes || '',

          // Regime Tributário
          taxRegime: clientData.taxRegime,
        };

        setClient(mappedClient);
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Erro ao carregar cliente';
        toast.error(errorMessage);
        router.push('/clients');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchClient();
    }
  }, [params.id, router]);

  const handleUpdateClient = async (data: any) => {
    try {
      // Mapear dados do frontend para o formato do backend (nova estrutura)
      const clientData = {
        // Dados Básicos
        razaoSocial: data.razaoSocial,
        nomeFantasia: data.nomeFantasia || undefined,
        cnpj: (data.cnpj || '').replace(/\D/g, ''), // Remove formatação
        cpf: data.cpf || undefined,
        inscricaoEstadual: data.inscricaoEstadual || undefined,
        inscricaoMunicipal: data.inscricaoMunicipal || undefined,
        taxRegime: data.taxRegime,
        status: data.status || 'ATIVO',

        // Endereço e Contato
        endereco: data.endereco,
        numero: data.numero,
        complemento: data.complemento || undefined,
        bairro: data.bairro,
        cidade: data.cidade,
        estado: data.estado,
        cep: (data.cep || '').replace(/\D/g, ''), // Remove formatação
        telefone: data.telefone || undefined,
        celular: data.celular || undefined,
        email: data.email || undefined,
        emailContador: data.emailContador || undefined,

        // Situação Cadastral
        dataAbertura: data.dataAbertura ? new Date(data.dataAbertura).toISOString() : undefined,
        dataSituacao: data.dataSituacao ? new Date(data.dataSituacao).toISOString() : undefined,
        inicioAtividade: data.inicioAtividade ? new Date(data.inicioAtividade).toISOString() : undefined,
        inicioEscritorio: data.inicioEscritorio ? new Date(data.inicioEscritorio).toISOString() : undefined,

        // Simples Nacional
        codigoSimples: data.codigoSimples || undefined,
        porte: data.porte && data.porte !== '' ? data.porte : undefined,
        porcPJEcac: data.porcPJEcac && data.porcPJEcac !== '' ? data.porcPJEcac : undefined,
        procPFEcac: data.procPFEcac && data.procPFEcac !== '' ? data.procPFEcac : undefined,

        // Departamento
        departmentId: data.departmentId || undefined,

        // Dados Financeiros
        capitalSocial: data.capitalSocial && data.capitalSocial > 0 ? data.capitalSocial : undefined,
        valorMensal: data.valorMensal && data.valorMensal > 0 ? data.valorMensal : undefined,
        dataVencimento: data.dataVencimento ? new Date(data.dataVencimento).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),

        // Atividade
        atividadePrincipal: data.atividadePrincipal || undefined,

        // Observações
        observacoes: data.observacoes || undefined,
      };

      const { clientsApi } = await import('@/lib/api');
      await clientsApi.update(Number(params.id), clientData);

      toast.success('Cliente atualizado com sucesso!');
      router.push('/clients');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao atualizar cliente';
      toast.error(errorMessage);
      console.error('Erro:', error);
    }
  };

  const handleCancel = () => {
    router.push('/clients');
  };

  if (loading) {
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
                  <BreadcrumbPage>Editar Cliente</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando cliente...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!client) {
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
                  <BreadcrumbPage>Cliente não encontrado</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Cliente não encontrado</h2>
              <p className="text-muted-foreground mb-4">
                O cliente solicitado não foi encontrado.
              </p>
              <Button onClick={() => router.push('/clients')}>
                Voltar para Clientes
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

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
                <BreadcrumbPage>Editar Cliente</BreadcrumbPage>
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
            <h1 className="text-2xl font-bold">Editar Cliente</h1>
            <p className="text-muted-foreground">
              {client.razaoSocial}
            </p>
          </div>
        </div>

        {/* Formulário */}
        <div className="w-full flex-1">
          <ClientForm
            client={client}
            onSubmit={handleUpdateClient}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </>
  );
}
