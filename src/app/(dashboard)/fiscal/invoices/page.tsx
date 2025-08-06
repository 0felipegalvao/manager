'use client';

import { useState } from 'react';
import { Plus, Search, Filter, Download, Eye, MoreHorizontal, FileText, CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react';
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
const mockInvoices = [
  {
    id: 1,
    number: '000001',
    series: '1',
    type: 'NFe',
    client: 'Empresa ABC Ltda',
    cnpj: '12.345.678/0001-90',
    value: 15750.00,
    issueDate: '2024-01-15',
    status: 'Autorizada',
    key: '35240112345678000190550010000000011123456789'
  },
  {
    id: 2,
    number: '000002',
    series: '1',
    type: 'NFCe',
    client: 'João Silva',
    cnpj: '123.456.789-00',
    value: 89.90,
    issueDate: '2024-01-14',
    status: 'Cancelada',
    key: '35240112345678000190650010000000021234567890'
  },
  {
    id: 3,
    number: '000003',
    series: '1',
    type: 'NFSe',
    client: 'Tech Solutions S.A.',
    cnpj: '98.765.432/0001-10',
    value: 2500.00,
    issueDate: '2024-01-13',
    status: 'Pendente',
    key: '35240112345678000190550010000000031345678901'
  },
  {
    id: 4,
    number: '000004',
    series: '1',
    type: 'NFe',
    client: 'Comércio XYZ Ltda',
    cnpj: '11.222.333/0001-44',
    value: 5420.75,
    issueDate: '2024-01-12',
    status: 'Rejeitada',
    key: '35240112345678000190550010000000041456789012'
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Autorizada':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'Pendente':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'Cancelada':
      return <XCircle className="h-4 w-4 text-gray-500" />;
    case 'Rejeitada':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return <FileText className="h-4 w-4 text-blue-500" />;
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Autorizada':
      return 'default';
    case 'Pendente':
      return 'secondary';
    case 'Cancelada':
      return 'outline';
    case 'Rejeitada':
      return 'destructive';
    default:
      return 'secondary';
  }
};

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [invoices] = useState(mockInvoices);

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.number.includes(searchTerm) ||
                         invoice.cnpj.includes(searchTerm);
    const matchesType = selectedType === 'all' || invoice.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || invoice.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalValue = invoices.reduce((acc, invoice) => acc + invoice.value, 0);
  const authorizedCount = invoices.filter(i => i.status === 'Autorizada').length;
  const pendingCount = invoices.filter(i => i.status === 'Pendente').length;

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
                <BreadcrumbLink href="/fiscal">Fiscal</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Notas Fiscais</BreadcrumbPage>
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
              <CardTitle className="text-sm font-medium">Total de Notas</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{invoices.length}</div>
              <p className="text-xs text-muted-foreground">
                +{invoices.filter(i => new Date(i.issueDate) > new Date(Date.now() - 7*24*60*60*1000)).length} esta semana
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <Badge variant="default" className="h-4 w-4 p-0"></Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                Valor total das notas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Autorizadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{authorizedCount}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((authorizedCount / invoices.length) * 100)}% do total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{pendingCount}</div>
              <p className="text-xs text-muted-foreground">
                Aguardando processamento
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Controles e filtros */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Gestão de Notas Fiscais</CardTitle>
                <CardDescription>
                  Emissão, controle e acompanhamento de NFe, NFCe e NFSe
                </CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Nota Fiscal
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por cliente, número ou CNPJ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="NFe">NFe</SelectItem>
                  <SelectItem value="NFCe">NFCe</SelectItem>
                  <SelectItem value="NFSe">NFSe</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Autorizada">Autorizada</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Cancelada">Cancelada</SelectItem>
                  <SelectItem value="Rejeitada">Rejeitada</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>

            {/* Tabela de notas fiscais */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nota Fiscal</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Data Emissão</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-blue-500" />
                          <div>
                            <div className="font-medium">{invoice.type} {invoice.number}/{invoice.series}</div>
                            <div className="text-sm text-muted-foreground font-mono">
                              {invoice.key.substring(0, 20)}...
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{invoice.client}</div>
                          <div className="text-sm text-muted-foreground">{invoice.cnpj}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">
                        R$ {invoice.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        {new Date(invoice.issueDate).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(invoice.status)}
                          <Badge variant={getStatusVariant(invoice.status)}>
                            {invoice.status}
                          </Badge>
                        </div>
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
                              Download XML
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download PDF
                            </DropdownMenuItem>
                            {invoice.status === 'Autorizada' && (
                              <DropdownMenuItem className="text-red-600">
                                Cancelar
                              </DropdownMenuItem>
                            )}
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
    </>
  )
}
