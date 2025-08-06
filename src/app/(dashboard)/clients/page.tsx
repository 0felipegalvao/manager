'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Building2, Mail, Phone, MapPin, Upload, Eye, Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { clientsApi } from '@/lib/api';
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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { DeleteClientDialog } from '@/components/clients/delete-client-dialog';
import { ImportExportDialog } from '@/components/clients/import-export-dialog';
// Interface do Cliente
interface Client {
  id: string;
  razaoSocial: string;
  nomeFantasia?: string;
  documento: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  tiposPessoa: 'FISICA' | 'JURIDICA';
  regimeTributario: 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL' | 'MEI';
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  telefone: string;
  email: string;
  status: 'ATIVO' | 'INATIVO';
  tags: string[];
  customFields?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Dados mock expandidos
const mockClients: Client[] = [
  {
    id: '1',
    razaoSocial: 'Empresa ABC Ltda',
    nomeFantasia: 'ABC Comércio',
    documento: '12345678000190',
    inscricaoEstadual: '123456789',
    inscricaoMunicipal: '987654321',
    tiposPessoa: 'JURIDICA',
    regimeTributario: 'SIMPLES_NACIONAL',
    cep: '01234567',
    logradouro: 'Rua das Flores',
    numero: '123',
    complemento: 'Sala 1',
    bairro: 'Centro',
    cidade: 'São Paulo',
    estado: 'SP',
    telefone: '11999999999',
    email: 'contato@empresaabc.com',
    status: 'ATIVO',
    tags: ['cliente', 'premium'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    razaoSocial: 'João Silva',
    documento: '12345678900',
    tiposPessoa: 'FISICA',
    regimeTributario: 'MEI',
    cep: '87654321',
    logradouro: 'Avenida Brasil',
    numero: '456',
    bairro: 'Copacabana',
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    telefone: '21888888888',
    email: 'joao.silva@email.com',
    status: 'ATIVO',
    tags: ['mei'],
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
  },
  {
    id: '3',
    razaoSocial: 'Tech Solutions S.A.',
    nomeFantasia: 'TechSol',
    documento: '98765432000110',
    inscricaoEstadual: '987654321',
    tiposPessoa: 'JURIDICA',
    regimeTributario: 'LUCRO_REAL',
    cep: '30123456',
    logradouro: 'Rua da Tecnologia',
    numero: '789',
    bairro: 'Savassi',
    cidade: 'Belo Horizonte',
    estado: 'MG',
    telefone: '31777777777',
    email: 'admin@techsolutions.com',
    status: 'INATIVO',
    tags: ['tecnologia', 'software'],
    createdAt: '2024-01-05T09:15:00Z',
    updatedAt: '2024-01-12T16:45:00Z',
  },
];

export default function ClientsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados dos modais (apenas para import/export e delete)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);

  // Cliente selecionado para exclusão
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);

  // Carregar clientes do backend
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const clientsData = await clientsApi.getAll();

        // Mapear dados do backend para o formato do frontend
        const mappedClients = clientsData.map((client: any) => ({
          id: client.id.toString(),
          razaoSocial: client.razaoSocial,
          nomeFantasia: client.nomeFantasia || '',
          documento: client.cnpj,
          inscricaoEstadual: client.inscricaoEstadual || '',
          inscricaoMunicipal: client.inscricaoMunicipal || '',
          tiposPessoa: 'JURIDICA' as const, // Assumindo JURIDICA por ter CNPJ
          regimeTributario: client.taxRegime,
          cep: client.cep,
          logradouro: client.endereco,
          numero: client.numero,
          complemento: client.complemento || '',
          bairro: client.bairro,
          cidade: client.cidade,
          estado: client.estado,
          telefone: client.telefone || '',
          email: client.email || '',
          status: client.status,
          tags: [],
          createdAt: client.createdAt,
          updatedAt: client.updatedAt,
        }));

        setClients(mappedClients);
      } catch (error: any) {
        console.error('Erro ao carregar clientes:', error);
        toast.error('Erro ao carregar clientes');
        // Em caso de erro, usar dados mock como fallback
        setClients(mockClients);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (client.nomeFantasia && client.nomeFantasia.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesType = typeFilter === 'all' || client.tiposPessoa === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Funções de navegação
  const handleNewClient = () => {
    router.push('/clients/new');
  };

  const handleViewClient = (client: Client) => {
    router.push(`/clients/${client.id}`);
  };

  const handleEditClient = (client: Client) => {
    router.push(`/clients/${client.id}/edit`);
  };

  const handleDeleteClick = (client: Client) => {
    setSelectedClient(client);
    setShowDeleteDialog(true);
  };

  const handleDeleteClient = async (client: Client) => {
    setIsLoading(true);
    try {
      await clientsApi.delete(Number(client.id));

      setClients(clients.filter(c => c.id !== client.id));
      setShowDeleteDialog(false);
      setSelectedClient(null);
      toast.success('Cliente excluído com sucesso!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao excluir cliente';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async (file: File) => {
    // Implementar lógica de importação
    console.log('Importando arquivo:', file);
  };

  const handleExport = async () => {
    // Implementar lógica de exportação
    const csvContent = 'data:text/csv;charset=utf-8,' +
      'Razão Social,Nome Fantasia,CNPJ/CPF,Email,Telefone,Status\n' +
      clients.map(client =>
        `${client.razaoSocial},${client.nomeFantasia || ''},${client.documento},${client.email},${client.telefone},${client.status}`
      ).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'clientes.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDocument = (doc: string, type: 'FISICA' | 'JURIDICA') => {
    if (type === 'JURIDICA') {
      return doc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    } else {
      return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
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
                <BreadcrumbPage>Clientes</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Header com estatísticas */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clients.length}</div>
              <p className="text-xs text-muted-foreground">
                +2 novos este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
              <Badge variant="default" className="h-4 w-4 p-0"></Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {clients.filter(c => c.status === 'ATIVO').length}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((clients.filter(c => c.status === 'ATIVO').length / clients.length) * 100)}% do total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pessoa Jurídica</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {clients.filter(c => c.tiposPessoa === 'JURIDICA').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Empresas cadastradas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pessoa Física</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {clients.filter(c => c.tiposPessoa === 'FISICA').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Pessoas cadastradas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Controles e filtros */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Gestão de Clientes</CardTitle>
                <CardDescription>
                  Gerencie todos os seus clientes em um só lugar
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setShowImportExport(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Importar/Exportar
                </Button>
                <Button onClick={handleNewClient}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Cliente
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar clientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="ATIVO">Ativo</SelectItem>
                  <SelectItem value="INATIVO">Inativo</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="JURIDICA">Pessoa Jurídica</SelectItem>
                  <SelectItem value="FISICA">Pessoa Física</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Mais Filtros
              </Button>
            </div>

            {/* Tabela de clientes */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{client.razaoSocial}</div>
                          <div className="text-sm text-muted-foreground">
                            {client.tiposPessoa === 'JURIDICA' ? 'Pessoa Jurídica' : 'Pessoa Física'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3" />
                            {client.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3" />
                            {formatPhone(client.telefone)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {formatDocument(client.documento, client.tiposPessoa)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          {client.cidade}/{client.estado}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={client.status === 'ATIVO' ? 'default' : 'secondary'}>
                          {client.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewClient(client)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditClient(client)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(client)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
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
          </CardContent>
        </Card>
      </div>

      {/* Modais */}
      {selectedClient && (
        <DeleteClientDialog
          client={selectedClient}
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={handleDeleteClient}
          isLoading={isLoading}
        />
      )}

      <ImportExportDialog
        open={showImportExport}
        onOpenChange={setShowImportExport}
        onImport={handleImport}
        onExport={handleExport}
      />
    </>
  )
}
