"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { 
  Building2, 
  MapPin, 
  FileText, 
  Calendar, 
  Settings,
  Users, 
  Phone, 
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2
} from "lucide-react"

// Schema para sócios
const partnerSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  cpf: z.string().optional(),
  participacao: z.number().min(0).max(100).optional(),
  qualificacao: z.string().optional(),
});

// Schema para contatos adicionais
const contactSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido').optional(),
  phone: z.string().optional(),
  cellphone: z.string().optional(),
  position: z.string().optional(),
  department: z.string().optional(),
  isActive: z.boolean(),
});

// Schema para histórico de regime tributário
const taxRegimeHistorySchema = z.object({
  taxRegime: z.enum(['SIMPLES_NACIONAL', 'LUCRO_PRESUMIDO', 'LUCRO_REAL', 'MEI']),
  startDate: z.string(),
  endDate: z.string().optional(),
  reason: z.string().optional(),
});

// Schema principal do cliente
const clientSchema = z.object({
  // Dados Básicos
  razaoSocial: z.string().min(1, 'Razão Social é obrigatória'),
  nomeFantasia: z.string().optional(),
  cnpj: z.string().min(14, 'CNPJ deve ter 14 dígitos').max(14, 'CNPJ deve ter 14 dígitos'),
  cpf: z.string().optional(),
  inscricaoEstadual: z.string().optional(),
  inscricaoMunicipal: z.string().optional(),

  // Endereço e Contato
  cep: z.string().min(8, 'CEP deve ter 8 dígitos').max(8, 'CEP deve ter 8 dígitos'),
  endereco: z.string().min(1, 'Endereço é obrigatório'),
  numero: z.string().min(1, 'Número é obrigatório'),
  complemento: z.string().optional(),
  bairro: z.string().min(1, 'Bairro é obrigatório'),
  cidade: z.string().min(1, 'Cidade é obrigatória'),
  estado: z.string().min(2, 'Estado deve ter 2 caracteres').max(2, 'Estado deve ter 2 caracteres'),
  telefone: z.string().optional(),
  celular: z.string().optional(),
  email: z.string().email('Email inválido').optional(),
  emailContador: z.string().email('Email inválido').optional(),
  
  // Regime Tributário
  taxRegime: z.enum(['SIMPLES_NACIONAL', 'LUCRO_PRESUMIDO', 'LUCRO_REAL', 'MEI']),
  
  // Situação Cadastral
  status: z.enum(['ATIVO', 'INATIVO']),
  dataAbertura: z.string().optional(),
  dataSituacao: z.string().optional(),
  inicioAtividade: z.string().optional(),
  inicioEscritorio: z.string().optional(),
  
  // Simples Nacional
  codigoSimples: z.string(),
  porte: z.string(),
  porcPJEcac: z.string(),
  procPFEcac: z.string(),
  
  // Departamento (por enquanto singular, mas interface múltipla)
  departmentId: z.number().nullable().optional(),
  
  // Dados Financeiros
  capitalSocial: z.number(),
  valorMensal: z.number(),
  dataVencimento: z.string().min(1, 'Data de vencimento é obrigatória'),
  
  // Atividade
  atividadePrincipal: z.string().optional(),
  
  // Observações
  observacoes: z.string().optional(),
  
  // Arrays relacionais
  partners: z.array(partnerSchema),
  clientContacts: z.array(contactSchema),
  taxRegimeHistory: z.array(taxRegimeHistorySchema),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  client?: Partial<ClientFormData>;
  onSubmit: (data: ClientFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ClientForm({ client, onSubmit, onCancel, isLoading }: ClientFormProps) {
  // Estado para controlar seções abertas
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'dados-basicos': true, // Primeira seção aberta por padrão
    'endereco-contato': false,
    'regime-tributario': false,
    'situacao-cadastral': false,
    'simples-nacional': false,
    'socios': false,
    'contatos-adicionais': false,
    'departamento': false,
  });

  const [departments] = useState<Array<{id: number, name: string}>>([
    { id: 1, name: 'Folha/Fiscal' },
    { id: 2, name: 'Contábil' },
    { id: 3, name: 'Societário' },
    { id: 4, name: 'Trabalhista' }
  ]);

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      // Dados Básicos
      razaoSocial: client?.razaoSocial ?? '',
      nomeFantasia: client?.nomeFantasia ?? '',
      cnpj: client?.cnpj ?? '',
      cpf: client?.cpf ?? '',
      inscricaoEstadual: client?.inscricaoEstadual ?? '',
      inscricaoMunicipal: client?.inscricaoMunicipal ?? '',

      // Endereço e Contato
      cep: client?.cep ?? '',
      endereco: client?.endereco ?? '',
      numero: client?.numero ?? '',
      complemento: client?.complemento ?? '',
      bairro: client?.bairro ?? '',
      cidade: client?.cidade ?? '',
      estado: client?.estado ?? '',
      telefone: client?.telefone ?? '',
      celular: client?.celular ?? '',
      email: client?.email ?? '',
      emailContador: client?.emailContador ?? '',
      
      // Regime Tributário
      taxRegime: client?.taxRegime || 'SIMPLES_NACIONAL',
      
      // Situação Cadastral
      status: client?.status ?? 'ATIVO',
      dataAbertura: client?.dataAbertura ?? '',
      dataSituacao: client?.dataSituacao ?? '',
      inicioAtividade: client?.inicioAtividade ?? '',
      inicioEscritorio: client?.inicioEscritorio ?? '',

      // Simples Nacional
      codigoSimples: client?.codigoSimples ?? '',
      porte: client?.porte ?? '',
      porcPJEcac: client?.porcPJEcac ?? '',
      procPFEcac: client?.procPFEcac ?? '',

      // Departamento (por enquanto singular, mas interface múltipla)
      departmentId: client?.departmentId ?? null,

      // Dados Financeiros
      capitalSocial: client?.capitalSocial ?? 0,
      valorMensal: client?.valorMensal ?? 0,
      dataVencimento: client?.dataVencimento ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],

      // Atividade
      atividadePrincipal: client?.atividadePrincipal ?? '',

      // Observações
      observacoes: client?.observacoes ?? '',
      
      // Arrays relacionais
      partners: client?.partners || [],
      clientContacts: client?.clientContacts || [],
      taxRegimeHistory: client?.taxRegimeHistory || [],
    },
  });

  // Field arrays para gerenciar arrays dinâmicos
  const { fields: partnerFields, append: appendPartner, remove: removePartner } = useFieldArray({
    control: form.control,
    name: "partners"
  });

  const { fields: contactFields, append: appendContact, remove: removeContact } = useFieldArray({
    control: form.control,
    name: "clientContacts"
  });

  const { fields: taxHistoryFields, append: appendTaxHistory, remove: removeTaxHistory } = useFieldArray({
    control: form.control,
    name: "taxRegimeHistory"
  });

  // Função para alternar seções
  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Buscar CEP
  const handleCepBlur = async (cep: string) => {
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          form.setValue('endereco', data.logradouro);
          form.setValue('bairro', data.bairro);
          form.setValue('cidade', data.localidade);
          form.setValue('estado', data.uf);
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  const handleSubmit = (data: ClientFormData) => {
    onSubmit(data);
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">



          <div className="space-y-4">

            {/* 1. DADOS BÁSICOS */}
            <Collapsible
              open={openSections['dados-basicos']}
              onOpenChange={() => toggleSection('dados-basicos')}
            >
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-primary" />
                        <div>
                          <CardTitle className="text-lg">Dados Básicos</CardTitle>
                          <CardDescription>
                            Razão social, CNPJ, inscrições estadual e municipal
                          </CardDescription>
                        </div>
                      </div>
                      {openSections['dados-basicos'] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="razaoSocial"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Razão Social <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Nome da empresa" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="nomeFantasia"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Fantasia</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Nome fantasia (opcional)" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cnpj"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CNPJ <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="00.000.000/0000-00" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cpf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CPF do Responsável</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="000.000.000-00" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="inscricaoEstadual"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Inscrição Estadual</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Inscrição estadual" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="inscricaoMunicipal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Inscrição Municipal</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Inscrição municipal" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ATIVO">Ativo</SelectItem>
                                <SelectItem value="INATIVO">Inativo</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="atividadePrincipal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Atividade Principal</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Descrição da atividade principal" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* 2. ENDEREÇO E CONTATO */}
            <Collapsible
              open={openSections['endereco-contato']}
              onOpenChange={() => toggleSection('endereco-contato')}
            >
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-primary" />
                        <div>
                          <CardTitle className="text-lg">Endereço e Contato</CardTitle>
                          <CardDescription>
                            Endereço completo, telefones e emails
                          </CardDescription>
                        </div>
                      </div>
                      {openSections['endereco-contato'] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="cep"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CEP <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="00000-000"
                                onBlur={(e) => handleCepBlur(e.target.value.replace(/\D/g, ''))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="endereco"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Endereço <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Rua, avenida, etc." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="numero"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="123" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="complemento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Complemento</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Apto, sala, etc." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bairro"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bairro <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Nome do bairro" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cidade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cidade <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Nome da cidade" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="estado"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estado <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="SP" maxLength={2} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="telefone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="(11) 3000-0000" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="celular"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Celular</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="(11) 99999-9999" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" placeholder="contato@empresa.com" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="emailContador"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email do Contador</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" placeholder="contador@escritorio.com" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* 3. REGIME TRIBUTÁRIO */}
            <Collapsible
              open={openSections['regime-tributario']}
              onOpenChange={() => toggleSection('regime-tributario')}
            >
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <CardTitle className="text-lg">Regime Tributário</CardTitle>
                          <CardDescription>
                            Regime atual e histórico de mudanças
                          </CardDescription>
                        </div>
                      </div>
                      {openSections['regime-tributario'] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="taxRegime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Regime Tributário <span className="text-red-500">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="SIMPLES_NACIONAL">Simples Nacional</SelectItem>
                                <SelectItem value="LUCRO_PRESUMIDO">Lucro Presumido</SelectItem>
                                <SelectItem value="LUCRO_REAL">Lucro Real</SelectItem>
                                <SelectItem value="MEI">MEI</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dataVencimento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data de Vencimento <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input {...field} type="date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* 4. DEPARTAMENTO */}
            <Collapsible
              open={openSections['departamento']}
              onOpenChange={() => toggleSection('departamento')}
            >
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-primary" />
                        <div>
                          <CardTitle className="text-lg">Departamento</CardTitle>
                          <CardDescription>
                            Atribuição a departamentos internos
                          </CardDescription>
                        </div>
                      </div>
                      {openSections['departamento'] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="departmentId"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Departamento Responsável</FormLabel>
                            <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                              {departments.map((dept) => (
                                <div key={dept.id} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`dept-${dept.id}`}
                                    checked={field.value === dept.id}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        // Selecionar este departamento
                                        field.onChange(dept.id);
                                      } else {
                                        // Desmarcar se for o mesmo
                                        if (field.value === dept.id) {
                                          field.onChange(undefined);
                                        }
                                      }
                                    }}
                                  />
                                  <Label
                                    htmlFor={`dept-${dept.id}`}
                                    className="text-sm font-normal cursor-pointer"
                                  >
                                    {dept.name}
                                  </Label>
                                </div>
                              ))}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Selecione o departamento responsável pelo cliente
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="valorMensal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valor Mensal</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="observacoes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Observações</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Observações gerais sobre o cliente..."
                              rows={4}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

          </div>

          {/* BOTÕES DE AÇÃO */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar Cliente'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
