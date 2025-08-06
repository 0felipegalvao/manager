'use client';

import { useState } from 'react';
import { Upload, Search, Filter, Download, Eye, MoreHorizontal, FileText, Calculator, TrendingUp, Calendar } from 'lucide-react';
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
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

// Dados mock para demonstração
const mockAccountingDocs = [
  {
    id: 1,
    name: 'Balanço Patrimonial 2023',
    type: 'Balanço',
    client: 'Empresa ABC Ltda',
    period: '2023',
    size: '2.1 MB',
    uploadDate: '2024-01-15',
    status: 'Aprovado',
    category: 'Demonstrativo'
  },
  {
    id: 2,
    name: 'DRE - Dezembro 2023',
    type: 'DRE',
    client: 'Tech Solutions S.A.',
    period: '12/2023',
    size: '856 KB',
    uploadDate: '2024-01-10',
    status: 'Pendente',
    category: 'Demonstrativo'
  },
  {
    id: 3,
    name: 'Livro Diário - Janeiro 2024',
    type: 'Livro Diário',
    client: 'Comércio XYZ Ltda',
    period: '01/2024',
    size: '4.2 MB',
    uploadDate: '2024-01-08',
    status: 'Aprovado',
    category: 'Escrituração'
  },
  {
    id: 4,
    name: 'Balancete de Verificação',
    type: 'Balancete',
    client: 'João Silva ME',
    period: '01/2024',
    size: '1.3 MB',
    uploadDate: '2024-01-05',
    status: 'Revisão',
    category: 'Demonstrativo'
  },
  {
    id: 5,
    name: 'SPED Contábil 2023',
    type: 'SPED',
    client: 'Empresa ABC Ltda',
    period: '2023',
    size: '15.7 MB',
    uploadDate: '2024-01-03',
    status: 'Aprovado',
    category: 'Obrigatório'
  },
];

const getDocIcon = (type: string) => {
  switch (type) {
    case 'Balanço':
      return <TrendingUp className="h-4 w-4 text-blue-500" />;
    case 'DRE':
      return <Calculator className="h-4 w-4 text-green-500" />;
    case 'Livro Diário':
      return <FileText className="h-4 w-4 text-purple-500" />;
    case 'Balancete':
      return <Calendar className="h-4 w-4 text-orange-500" />;
    case 'SPED':
      return <FileText className="h-4 w-4 text-red-500" />;
    default:
      return <FileText className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Aprovado':
      return 'default';
    case 'Pendente':
      return 'secondary';
    case 'Revisão':
      return 'outline';
    default:
      return 'secondary';
  }
};

export default function AccountingDocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [documents] = useState(mockAccountingDocs);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = ['Demonstrativo', 'Escrituração', 'Obrigatório'];
  const totalSize = documents.reduce((acc, doc) => {
    const size = parseFloat(doc.size.replace(/[^\d.]/g, ''));
    return acc + size;
  }, 0);

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
                <BreadcrumbLink href="/documents">Documentos</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Documentos Contábeis</BreadcrumbPage>
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
              <CardTitle className="text-sm font-medium">Total de Documentos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documents.length}</div>
              <p className="text-xs text-muted-foreground">
                +2 novos esta semana
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Espaço Utilizado</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSize.toFixed(1)} MB</div>
              <p className="text-xs text-muted-foreground">
                Documentos contábeis
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {documents.filter(d => d.status === 'Aprovado').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Documentos validados
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Revisão</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">
                {documents.filter(d => d.status === 'Revisão' || d.status === 'Pendente').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Aguardando análise
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Controles e filtros */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Documentos Contábeis</CardTitle>
                <CardDescription>
                  Demonstrativos financeiros, livros contábeis e documentos obrigatórios
                </CardDescription>
              </div>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload Documento
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar documentos contábeis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Aprovado">Aprovado</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Revisão">Revisão</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>

            {/* Tabela de documentos */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Documento</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Tamanho</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((document) => (
                    <TableRow key={document.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {getDocIcon(document.type)}
                          <div>
                            <div className="font-medium">{document.name}</div>
                            <div className="text-sm text-muted-foreground">{document.type}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{document.client}</TableCell>
                      <TableCell className="font-mono text-sm">{document.period}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{document.category}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{document.size}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(document.status)}>
                          {document.status}
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
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem>Aprovar</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
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

        {/* Seção de templates e modelos */}
        <Card>
          <CardHeader>
            <CardTitle>Templates e Modelos</CardTitle>
            <CardDescription>
              Modelos pré-configurados para documentos contábeis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <h3 className="font-medium">Balanço Patrimonial</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Template padrão para balanço patrimonial
                </p>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Template
                </Button>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Calculator className="h-5 w-5 text-green-500" />
                  <h3 className="font-medium">DRE</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Demonstração do Resultado do Exercício
                </p>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Template
                </Button>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="h-5 w-5 text-purple-500" />
                  <h3 className="font-medium">Livro Diário</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Modelo para escrituração do livro diário
                </p>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Template
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
