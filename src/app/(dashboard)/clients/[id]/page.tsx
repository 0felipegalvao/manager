'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Trash2, MapPin, Phone, Mail, Building2, FileText, Calendar, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { DeleteClientDialog } from '@/components/clients/delete-client-dialog';
import { toast } from 'sonner';



export default function ClientDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
          tiposPessoa: 'JURIDICA' as const,
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

  const handleEdit = () => {
    router.push(`/clients/${params.id}/edit`);
  };

  const handleDelete = async (client: any) => {
    try {
      const { clientsApi } = await import('@/lib/api');
      await clientsApi.delete(Number(client.id));

      toast.success('Cliente excluído com sucesso!');
      router.push('/clients');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao excluir cliente';
      toast.error(errorMessage);
      console.error('Erro:', error);
    }
  };

  const formatDocument = (doc: string, type: 'FISICA' | 'JURIDICA') => {
    if (type === 'JURIDICA') {
      return doc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    } else {
      return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
  };

  const formatCep = (cep: string) => {
    return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
  };

  const getRegimeLabel = (regime: string) => {
    const regimes = {
      SIMPLES_NACIONAL: 'Simples Nacional',
      LUCRO_PRESUMIDO: 'Lucro Presumido',
      LUCRO_REAL: 'Lucro Real',
      MEI: 'MEI',
    };
    return regimes[regime as keyof typeof regimes] || regime;
  };

  if (loading) {
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
                  <BreadcrumbLink href="/clients">Clientes</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Detalhes do Cliente</BreadcrumbPage>
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
                <BreadcrumbLink href="/clients">Clientes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Detalhes do Cliente</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        {/* Header da página */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push('/clients')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{client.razaoSocial}</h1>
                <Badge variant={client.status === 'ATIVO' ? 'default' : 'secondary'}>
                  {client.status}
                </Badge>
                <Badge variant="outline">
                  {client.tiposPessoa === 'JURIDICA' ? 'PJ' : 'PF'}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {client.nomeFantasia && `${client.nomeFantasia} • `}
                {formatDocument(client.documento, client.tiposPessoa)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </div>
        </div>

        <div className="grid gap-4 max-w-6xl">
          {/* Grid com 2 colunas para informações principais */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Informações Básicas */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="h-4 w-4" />
                  Informações Básicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">Razão Social:</span>
                    <span className="font-medium text-right max-w-[60%]">{client.razaoSocial}</span>
                  </div>

                  {client.nomeFantasia && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-muted-foreground">Nome Fantasia:</span>
                      <span className="font-medium text-right max-w-[60%]">{client.nomeFantasia}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {client.tiposPessoa === 'JURIDICA' ? 'CNPJ:' : 'CPF:'}
                    </span>
                    <span className="font-medium font-mono text-sm">
                      {formatDocument(client.documento, client.tiposPessoa)}
                    </span>
                  </div>

                  {client.inscricaoEstadual && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Insc. Estadual:</span>
                      <span className="font-medium">{client.inscricaoEstadual}</span>
                    </div>
                  )}

                  {client.inscricaoMunicipal && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Insc. Municipal:</span>
                      <span className="font-medium">{client.inscricaoMunicipal}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Regime Tributário:</span>
                    <span className="font-medium">{getRegimeLabel(client.regimeTributario)}</span>
                  </div>
                </div>

                {client.tags.length > 0 && (
                  <div className="pt-2 border-t">
                    <div className="flex flex-wrap gap-1">
                      {client.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Endereço e Contato */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-4 w-4" />
                  Endereço & Contato
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div>
                    <p className="font-medium text-sm">
                      {client.logradouro}, {client.numero}
                      {client.complemento && `, ${client.complemento}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {client.bairro} • {client.cidade}/{client.estado}
                    </p>
                    <p className="text-sm text-muted-foreground font-mono">
                      CEP: {formatCep(client.cep)}
                    </p>
                  </div>
                </div>

                {(client.telefone || client.email) && (
                  <div className="pt-2 border-t space-y-2">
                    {client.telefone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{client.telefone}</span>
                      </div>
                    )}
                    {client.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{client.email}</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Campos Personalizados */}
          {client.customFields && Object.keys(client.customFields).length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-4 w-4" />
                  Informações Adicionais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(client.customFields).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground capitalize">
                      {key.replace('_', ' ')}:
                    </span>
                    <span className="font-medium">
                      {typeof value === 'boolean' ? (value ? 'Sim' : 'Não') : String(value)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Histórico */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <History className="h-4 w-4" />
                Histórico
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Criado em:</span>
                <span className="font-medium text-sm">
                  {new Date(client.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Última atualização:</span>
                <span className="font-medium text-sm">
                  {new Date(client.updatedAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog de confirmação de exclusão */}
      <DeleteClientDialog
        client={client}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
      />
    </>
  );
}
