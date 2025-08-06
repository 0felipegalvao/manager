"use client"

import { AlertTriangle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Client {
  id: string
  razaoSocial: string
  nomeFantasia?: string
  cnpj: string
  cpf?: string
  inscricaoEstadual?: string
  inscricaoMunicipal?: string
  taxRegime: "SIMPLES_NACIONAL" | "LUCRO_PRESUMIDO" | "LUCRO_REAL" | "MEI"
  cep: string
  endereco: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  estado: string
  telefone?: string
  celular?: string
  email?: string
  emailContador?: string
  status: "ATIVO" | "INATIVO"
  dataAbertura?: string
  dataSituacao?: string
  inicioAtividade?: string
  inicioEscritorio?: string
  codigoSimples?: string
  porte?: string
  porcPJEcac?: string
  procPFEcac?: string
  departmentId?: number | null
  capitalSocial?: number
  valorMensal?: number
  dataVencimento?: string
  atividadePrincipal?: string
  observacoes?: string
  tags?: string[]
  customFields?: Record<string, any>
  createdAt?: string
  updatedAt?: string
}

interface DeleteClientDialogProps {
  client: Client | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (client: Client) => Promise<void> | void
  isLoading?: boolean
}

export function DeleteClientDialog({ 
  client, 
  open, 
  onOpenChange, 
  onConfirm, 
  isLoading 
}: DeleteClientDialogProps) {
  if (!client) return null;

  const formatDocument = (doc: string, type: 'FISICA' | 'JURIDICA') => {
    if (!doc) return '';
    if (type === 'JURIDICA') {
      return doc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    } else {
      return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <AlertDialogTitle>Excluir Cliente</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        
        <div className="py-4">
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Cliente:</span>
                <p className="font-semibold">{client.razaoSocial}</p>
                {client.nomeFantasia && (
                  <p className="text-sm text-muted-foreground">{client.nomeFantasia}</p>
                )}
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  CNPJ:
                </span>
                <p className="font-mono text-sm">
                  {formatDocument(client.cnpj, 'JURIDICA')}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              Ao excluir este cliente, você também removerá:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Todos os documentos associados</li>
              <li>• Histórico de obrigações fiscais</li>
              <li>• Notas fiscais emitidas</li>
              <li>• Relatórios e análises</li>
            </ul>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(client)}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isLoading ? 'Excluindo...' : 'Excluir Cliente'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
