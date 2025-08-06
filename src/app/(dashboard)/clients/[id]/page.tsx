'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Trash2, MapPin, Phone, Mail, Building2, FileText, Calendar, History, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

        // Mapear dados do backend para o formato do frontend (nova estrutura)
        const mappedClient = {
          id: clientData.id.toString(),
          razaoSocial: clientData.razaoSocial,
          nomeFantasia: clientData.nomeFantasia || '',
          cnpj: clientData.cnpj,
          cpf: clientData.cpf || '',
          inscricaoEstadual: clientData.inscricaoEstadual || '',
          inscricaoMunicipal: clientData.inscricaoMunicipal || '',
          taxRegime: clientData.taxRegime,
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
          status: clientData.status,
          dataAbertura: clientData.dataAbertura || '',
          dataSituacao: clientData.dataSituacao || '',
          inicioAtividade: clientData.inicioAtividade || '',
          inicioEscritorio: clientData.inicioEscritorio || '',
          codigoSimples: clientData.codigoSimples || '',
          porte: clientData.porte || '',
          porcPJEcac: clientData.porcPJEcac || '',
          procPFEcac: clientData.procPFEcac || '',
          departmentId: clientData.departmentId || null,
          capitalSocial: clientData.capitalSocial || 0,
          valorMensal: clientData.valorMensal || 0,
          dataVencimento: clientData.dataVencimento || '',
          atividadePrincipal: clientData.atividadePrincipal || '',
          observacoes: clientData.observacoes || '',
          tags: [], // Array vazio por enquanto
          customFields: clientData.customFields || {},
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
      
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0 max-w-none">
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
                  PJ
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {client.nomeFantasia && `${client.nomeFantasia} • `}
                {formatDocument(client.cnpj, 'JURIDICA')}
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

        <div className="space-y-6">
          {/* Tabs modernas para organizar as informações */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Visão Geral
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Contato
              </TabsTrigger>
              <TabsTrigger value="financial" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Financeiro
              </TabsTrigger>
              <TabsTrigger value="additional" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Adicional
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Visão Geral */}
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Informações Básicas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Razão Social</span>
                        <p className="font-medium">{client.razaoSocial}</p>
                      </div>

                      {client.nomeFantasia && (
                        <div>
                          <span className="text-xs text-muted-foreground uppercase tracking-wide">Nome Fantasia</span>
                          <p className="font-medium">{client.nomeFantasia}</p>
                        </div>
                      )}

                      <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">CNPJ</span>
                        <p className="font-mono text-sm font-medium">
                          {formatDocument(client.cnpj, 'JURIDICA')}
                        </p>
                      </div>

                      <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Regime Tributário</span>
                        <p className="font-medium">{getRegimeLabel(client.taxRegime)}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {client.inscricaoEstadual && (
                        <div>
                          <span className="text-xs text-muted-foreground uppercase tracking-wide">Inscrição Estadual</span>
                          <p className="font-medium">{client.inscricaoEstadual}</p>
                        </div>
                      )}

                      {client.inscricaoMunicipal && (
                        <div>
                          <span className="text-xs text-muted-foreground uppercase tracking-wide">Inscrição Municipal</span>
                          <p className="font-medium">{client.inscricaoMunicipal}</p>
                        </div>
                      )}

                      {client.porte && (
                        <div>
                          <span className="text-xs text-muted-foreground uppercase tracking-wide">Porte</span>
                          <p className="font-medium">{client.porte}</p>
                        </div>
                      )}

                      {client.codigoSimples && (
                        <div>
                          <span className="text-xs text-muted-foreground uppercase tracking-wide">Código Simples</span>
                          <p className="font-medium">{client.codigoSimples}</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {client.dataAbertura && (
                        <div>
                          <span className="text-xs text-muted-foreground uppercase tracking-wide">Data de Abertura</span>
                          <p className="font-medium">
                            {new Date(client.dataAbertura).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      )}

                      {client.inicioAtividade && (
                        <div>
                          <span className="text-xs text-muted-foreground uppercase tracking-wide">Início da Atividade</span>
                          <p className="font-medium">
                            {new Date(client.inicioAtividade).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      )}

                      {client.inicioEscritorio && (
                        <div>
                          <span className="text-xs text-muted-foreground uppercase tracking-wide">Início no Escritório</span>
                          <p className="font-medium">
                            {new Date(client.inicioEscritorio).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {client.tags && client.tags.length > 0 && (
                    <div className="pt-4 border-t mt-6">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">Tags</span>
                      <div className="flex flex-wrap gap-1 mt-2">
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
            </TabsContent>

            {/* Tab 2: Contato */}
            <TabsContent value="contact" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Endereço */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Endereço
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">Logradouro</span>
                      <p className="font-medium">
                        {client.endereco}, {client.numero}
                        {client.complemento && `, ${client.complemento}`}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">Bairro</span>
                      <p className="font-medium">{client.bairro}</p>
                    </div>

                    <div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">Cidade/Estado</span>
                      <p className="font-medium">{client.cidade}/{client.estado}</p>
                    </div>

                    <div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">CEP</span>
                      <p className="font-mono text-sm font-medium">{formatCep(client.cep)}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Contato */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      Contato
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {client.telefone && (
                      <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Telefone</span>
                        <p className="font-medium">{client.telefone}</p>
                      </div>
                    )}

                    {client.celular && (
                      <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Celular</span>
                        <p className="font-medium">{client.celular}</p>
                      </div>
                    )}

                    {client.email && (
                      <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">E-mail</span>
                        <p className="font-medium">{client.email}</p>
                      </div>
                    )}

                    {client.emailContador && (
                      <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">E-mail Contador</span>
                        <p className="font-medium">{client.emailContador}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab 3: Financeiro */}
            <TabsContent value="financial" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Dados Financeiros
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {client.capitalSocial && client.capitalSocial > 0 && (
                      <div className="p-4 border rounded-lg">
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Capital Social</span>
                        <p className="font-bold text-lg text-green-600">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(client.capitalSocial)}
                        </p>
                      </div>
                    )}

                    {client.valorMensal && client.valorMensal > 0 && (
                      <div className="p-4 border rounded-lg">
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Valor Mensal</span>
                        <p className="font-bold text-lg text-blue-600">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(client.valorMensal)}
                        </p>
                      </div>
                    )}

                    {client.dataVencimento && (
                      <div className="p-4 border rounded-lg">
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Data de Vencimento</span>
                        <p className="font-bold text-lg">
                          {new Date(client.dataVencimento).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 4: Adicional */}
            <TabsContent value="additional" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Atividade e Procurações */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Atividade e Procurações
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {client.atividadePrincipal && (
                      <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Atividade Principal</span>
                        <p className="font-medium">{client.atividadePrincipal}</p>
                      </div>
                    )}

                    {client.porcPJEcac && (
                      <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Procuração PJ ECAC</span>
                        <p className="font-medium">{client.porcPJEcac}</p>
                      </div>
                    )}

                    {client.procPFEcac && (
                      <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Procuração PF ECAC</span>
                        <p className="font-medium">{client.procPFEcac}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Observações */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Observações
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {client.observacoes ? (
                      <div>
                        <p className="font-medium text-sm leading-relaxed">{client.observacoes}</p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">Nenhuma observação cadastrada.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

          </Tabs>

          {/* Histórico - Fora do accordion */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <History className="h-5 w-5" />
                Histórico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Criado em</span>
                  <p className="font-medium">
                    {new Date(client.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Última atualização</span>
                  <p className="font-medium">
                    {new Date(client.updatedAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
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
