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

        // Mapear dados do backend para o formato do frontend
        const mappedClient = {
          id: clientData.id.toString(),
          razaoSocial: clientData.razaoSocial,
          nomeFantasia: clientData.nomeFantasia || '',
          documento: clientData.cnpj,
          inscricaoEstadual: clientData.inscricaoEstadual || '',
          inscricaoMunicipal: clientData.inscricaoMunicipal || '',
          tiposPessoa: 'JURIDICA' as const, // Assumindo JURIDICA por ter CNPJ
          regimeTributario: clientData.taxRegime,
          cep: clientData.cep,
          logradouro: clientData.endereco,
          numero: clientData.numero,
          complemento: clientData.complemento || '',
          bairro: clientData.bairro,
          cidade: clientData.cidade,
          estado: clientData.estado,
          telefone: clientData.telefone || '',
          email: clientData.email || '',
          status: clientData.status,
          tags: [],
          createdAt: clientData.createdAt,
          updatedAt: clientData.updatedAt,
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
      // Mapear dados do frontend para o formato do backend
      const clientData = {
        razaoSocial: data.razaoSocial,
        nomeFantasia: data.nomeFantasia || null,
        cnpj: data.documento.replace(/\D/g, ''), // Remove formatação
        inscricaoEstadual: data.inscricaoEstadual || null,
        inscricaoMunicipal: data.inscricaoMunicipal || null,
        taxRegime: data.regimeTributario,
        status: data.status || 'ATIVO',
        endereco: data.logradouro,
        numero: data.numero,
        complemento: data.complemento || null,
        bairro: data.bairro,
        cidade: data.cidade,
        estado: data.estado,
        cep: data.cep.replace(/\D/g, ''), // Remove formatação
        telefone: data.telefone || null,
        email: data.email || null,
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
