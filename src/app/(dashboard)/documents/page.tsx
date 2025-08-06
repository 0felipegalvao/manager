'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Upload, Search, Filter, Download, Eye, MoreHorizontal, FileText, Image, File, Calendar, Edit, Trash2 } from 'lucide-react';
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import { useApi, useMutation } from '@/hooks/useApi';
import { toast } from 'sonner';

interface Document {
  id: number;
  name: string;
  type: string;
  status: string;
  filePath?: string;
  fileSize?: number;
  uploadedAt: string;
  updatedAt: string;
  client: {
    id: number;
    razaoSocial: string;
    cnpj: string;
  };
  user: {
    id: number;
    name: string;
    email: string;
  };
}
export default function DocumentsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);

  // API calls
  const { data: documents, loading, error, refetch } = useApi<Document[]>(
    () => fetch('/api/documents', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    }).then(res => res.json()),
    []
  );

  const { mutate: deleteDocument, loading: deleting } = useMutation<void, number>(
    (id) => fetch(`/api/documents/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    }).then(res => {
      if (!res.ok) throw new Error('Erro ao deletar documento');
      return res.json();
    })
  );

  // Filtrar documentos
  const filteredDocuments = documents?.filter(document => {
    const matchesSearch = document.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         document.client.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || document.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || document.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  }) || [];

  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;

    const result = await deleteDocument(documentToDelete.id);
    if (result) {
      toast.success('Documento removido com sucesso');
      refetch();
      setDocumentToDelete(null);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'excel':
      case 'xlsx':
      case 'xls':
        return <File className="h-4 w-4 text-green-500" />;
      case 'xml':
        return <File className="h-4 w-4 text-blue-500" />;
      case 'image':
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <Image className="h-4 w-4 text-purple-500" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'APROVADO': 'default',
      'PENDENTE': 'secondary',
      'PROCESSANDO': 'default',
      'REJEITADO': 'destructive',
    } as const;

    const labels = {
      'APROVADO': 'Aprovado',
      'PENDENTE': 'Pendente',
      'PROCESSANDO': 'Processando',
      'REJEITADO': 'Rejeitado',
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
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
                <BreadcrumbPage>Documentos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Documentos</h1>
            <p className="text-muted-foreground">
              Gerencie os documentos dos clientes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
            <Button onClick={() => router.push('/documents/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Documento
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Documentos</CardTitle>
            <CardDescription>
              {filteredDocuments.length} documento(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="Excel">Excel</SelectItem>
                  <SelectItem value="XML">XML</SelectItem>
                  <SelectItem value="Image">Imagem</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="APROVADO">Aprovado</SelectItem>
                  <SelectItem value="PENDENTE">Pendente</SelectItem>
                  <SelectItem value="PROCESSANDO">Processando</SelectItem>
                  <SelectItem value="REJEITADO">Rejeitado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Documento</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tamanho</TableHead>
                    <TableHead>Upload</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((document) => (
                    <TableRow key={document.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {getFileIcon(document.type)}
                          <div>
                            <div className="font-medium">{document.name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{document.client.razaoSocial}</div>
                          <div className="text-sm text-muted-foreground">{document.client.cnpj}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{document.type}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(document.status)}</TableCell>
                      <TableCell>{formatFileSize(document.fileSize)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {new Date(document.uploadedAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => router.push(`/documents/${document.id}`)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDocumentToDelete(document)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
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

            {filteredDocuments.length === 0 && (
              <div className="flex h-[200px] items-center justify-center">
                <div className="text-center">
                  <h3 className="text-lg font-semibold">Nenhum documento encontrado</h3>
                  <p className="text-sm text-muted-foreground">
                    Tente ajustar os filtros ou fazer upload de um novo documento.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!documentToDelete} onOpenChange={() => setDocumentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o documento "{documentToDelete?.name}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDocument}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
