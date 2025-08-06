"use client"

import { useState } from "react"
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

interface ImportExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (file: File) => Promise<void>
  onExport: () => Promise<void>
}

export function ImportExportDialog({ 
  open, 
  onOpenChange, 
  onImport, 
  onExport 
}: ImportExportDialogProps) {
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [importResults, setImportResults] = useState<{
    total: number;
    success: number;
    errors: string[];
  } | null>(null);
  const [exportStatus, setExportStatus] = useState<'idle' | 'exporting' | 'success' | 'error'>('idle');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImportFile(file);
      setImportStatus('idle');
      setImportResults(null);
    }
  };

  const handleImport = async () => {
    if (!importFile) return;

    try {
      setImportStatus('uploading');
      setImportProgress(25);

      // Simular upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setImportStatus('processing');
      setImportProgress(50);

      // Processar arquivo
      await onImport(importFile);
      
      setImportProgress(100);
      setImportStatus('success');
      
      // Simular resultados
      setImportResults({
        total: 150,
        success: 147,
        errors: [
          'Linha 23: CNPJ inválido',
          'Linha 45: Email já existe',
          'Linha 89: CEP não encontrado'
        ]
      });

    } catch (error) {
      setImportStatus('error');
      console.error('Erro na importação:', error);
    }
  };

  const handleExport = async () => {
    try {
      setExportStatus('exporting');
      await onExport();
      setExportStatus('success');
      
      // Reset após 3 segundos
      setTimeout(() => setExportStatus('idle'), 3000);
    } catch (error) {
      setExportStatus('error');
      console.error('Erro na exportação:', error);
    }
  };

  const downloadTemplate = () => {
    // Criar CSV template
    const headers = [
      'razaoSocial',
      'nomeFantasia',
      'documento',
      'inscricaoEstadual',
      'inscricaoMunicipal',
      'tiposPessoa',
      'regimeTributario',
      'cep',
      'logradouro',
      'numero',
      'complemento',
      'bairro',
      'cidade',
      'estado',
      'telefone',
      'email',
      'status',
      'tags'
    ];

    const csvContent = headers.join(',') + '\n' +
      'Empresa Exemplo Ltda,Exemplo,12.345.678/0001-90,123456789,987654321,JURIDICA,SIMPLES_NACIONAL,01234567,Rua Exemplo,123,Sala 1,Centro,São Paulo,SP,(11) 99999-9999,contato@exemplo.com,ATIVO,"cliente,exemplo"';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_clientes.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Importar/Exportar Clientes</DialogTitle>
          <DialogDescription>
            Gerencie seus dados de clientes em lote
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="import" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="import">Importar</TabsTrigger>
            <TabsTrigger value="export">Exportar</TabsTrigger>
          </TabsList>

          <TabsContent value="import" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Importar Clientes
                </CardTitle>
                <CardDescription>
                  Importe clientes a partir de um arquivo CSV ou Excel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Template Download */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="h-8 w-8 text-green-600" />
                    <div>
                      <h4 className="font-medium">Template CSV</h4>
                      <p className="text-sm text-muted-foreground">
                        Baixe o modelo com os campos obrigatórios
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={downloadTemplate}>
                    <Download className="h-4 w-4 mr-2" />
                    Baixar Template
                  </Button>
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Selecionar Arquivo</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileSelect}
                      className="flex-1 text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                    <Button 
                      onClick={handleImport} 
                      disabled={!importFile || importStatus === 'uploading' || importStatus === 'processing'}
                    >
                      {importStatus === 'uploading' || importStatus === 'processing' ? 'Importando...' : 'Importar'}
                    </Button>
                  </div>
                </div>

                {/* Progress */}
                {(importStatus === 'uploading' || importStatus === 'processing') && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        {importStatus === 'uploading' ? 'Enviando arquivo...' : 'Processando dados...'}
                      </span>
                      <span>{importProgress}%</span>
                    </div>
                    <Progress value={importProgress} />
                  </div>
                )}

                {/* Results */}
                {importStatus === 'success' && importResults && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p>
                          <strong>Importação concluída!</strong>
                        </p>
                        <p>
                          {importResults.success} de {importResults.total} clientes importados com sucesso.
                        </p>
                        {importResults.errors.length > 0 && (
                          <div>
                            <p className="font-medium">Erros encontrados:</p>
                            <ul className="text-sm space-y-1 mt-1">
                              {importResults.errors.map((error, index) => (
                                <li key={index}>• {error}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {importStatus === 'error' && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Erro ao importar arquivo. Verifique o formato e tente novamente.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Instructions */}
                <div className="text-sm text-muted-foreground space-y-2">
                  <p><strong>Instruções:</strong></p>
                  <ul className="space-y-1 ml-4">
                    <li>• Use o template CSV para garantir o formato correto</li>
                    <li>• Campos obrigatórios: razaoSocial, documento, email, telefone</li>
                    <li>• CNPJ deve estar no formato: 12.345.678/0001-90</li>
                    <li>• CPF deve estar no formato: 123.456.789-00</li>
                    <li>• Tags devem ser separadas por vírgula</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Exportar Clientes
                </CardTitle>
                <CardDescription>
                  Exporte todos os clientes para um arquivo CSV
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-6 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="h-12 w-12 text-blue-600" />
                    <div>
                      <h4 className="font-medium">Exportar todos os clientes</h4>
                      <p className="text-sm text-muted-foreground">
                        Baixe um arquivo CSV com todos os dados dos clientes
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleExport}
                    disabled={exportStatus === 'exporting'}
                    size="lg"
                  >
                    {exportStatus === 'exporting' ? (
                      'Exportando...'
                    ) : exportStatus === 'success' ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Exportado!
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Exportar CSV
                      </>
                    )}
                  </Button>
                </div>

                {exportStatus === 'success' && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Arquivo exportado com sucesso! O download deve iniciar automaticamente.
                    </AlertDescription>
                  </Alert>
                )}

                {exportStatus === 'error' && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Erro ao exportar dados. Tente novamente.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="text-sm text-muted-foreground space-y-2">
                  <p><strong>O arquivo exportado incluirá:</strong></p>
                  <ul className="space-y-1 ml-4">
                    <li>• Todos os dados básicos dos clientes</li>
                    <li>• Informações de endereço e contato</li>
                    <li>• Status e tags</li>
                    <li>• Campos personalizados (se houver)</li>
                    <li>• Datas de criação e atualização</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
