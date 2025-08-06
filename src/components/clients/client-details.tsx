"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, MapPin, Phone, Mail, Building2, FileText, Calendar, History } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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

interface ClientDetailsProps {
  client: Client;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

export function ClientDetails({ client, open, onOpenChange, onEdit, onDelete }: ClientDetailsProps) {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">{client.razaoSocial}</DialogTitle>
              <DialogDescription>
                {client.nomeFantasia && `${client.nomeFantasia} • `}
                {formatDocument(client.documento, client.tiposPessoa)}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={client.status === 'ATIVO' ? 'default' : 'secondary'}>
                {client.status}
              </Badge>
              <Badge variant="outline">
                {client.tiposPessoa === 'JURIDICA' ? 'PJ' : 'PF'}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Ações */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onEdit(client)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button variant="destructive" onClick={() => onDelete(client)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </div>

          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Razão Social</label>
                  <p className="font-medium">{client.razaoSocial}</p>
                </div>
                {client.nomeFantasia && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nome Fantasia</label>
                    <p className="font-medium">{client.nomeFantasia}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    {client.tiposPessoa === 'JURIDICA' ? 'CNPJ' : 'CPF'}
                  </label>
                  <p className="font-medium font-mono">
                    {formatDocument(client.documento, client.tiposPessoa)}
                  </p>
                </div>
                {client.inscricaoEstadual && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Inscrição Estadual</label>
                    <p className="font-medium">{client.inscricaoEstadual}</p>
                  </div>
                )}
                {client.inscricaoMunicipal && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Inscrição Municipal</label>
                    <p className="font-medium">{client.inscricaoMunicipal}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Regime Tributário</label>
                <p className="font-medium">{getRegimeLabel(client.regimeTributario)}</p>
              </div>

              {client.tags.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tags</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {client.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Endereço
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">
                  {client.logradouro}, {client.numero}
                  {client.complemento && `, ${client.complemento}`}
                </p>
                <p className="text-muted-foreground">
                  {client.bairro} • {client.cidade}/{client.estado}
                </p>
                <p className="text-muted-foreground font-mono">
                  CEP: {formatCep(client.cep)}
                </p>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Telefone</label>
                    <p className="font-medium">{formatPhone(client.telefone)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="font-medium">{client.email}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campos Personalizados */}
          {client.customFields && Object.keys(client.customFields).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Campos Personalizados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(client.customFields).map(([key, value]) => (
                    <div key={key}>
                      <label className="text-sm font-medium text-muted-foreground">
                        Campo {key}
                      </label>
                      <p className="font-medium">
                        {typeof value === 'boolean' ? (value ? 'Sim' : 'Não') : String(value)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Histórico */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Histórico
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Criado em</label>
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
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Última atualização</label>
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
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
