"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { X, Plus, MapPin } from "lucide-react"

// Schema de validação
const clientSchema = z.object({
  razaoSocial: z.string().min(1, 'Razão Social é obrigatória'),
  nomeFantasia: z.string().optional(),
  documento: z.string().min(11, 'CNPJ/CPF é obrigatório'),
  inscricaoEstadual: z.string().optional(),
  inscricaoMunicipal: z.string().optional(),
  tiposPessoa: z.enum(['FISICA', 'JURIDICA']),
  regimeTributario: z.enum(['SIMPLES_NACIONAL', 'LUCRO_PRESUMIDO', 'LUCRO_REAL', 'MEI']),
  cep: z.string().min(8, 'CEP é obrigatório'),
  logradouro: z.string().min(1, 'Logradouro é obrigatório'),
  numero: z.string().min(1, 'Número é obrigatório'),
  complemento: z.string().optional(),
  bairro: z.string().min(1, 'Bairro é obrigatório'),
  cidade: z.string().min(1, 'Cidade é obrigatória'),
  estado: z.string().min(2, 'Estado é obrigatório').max(2),
  telefone: z.string().min(10, 'Telefone é obrigatório'),
  email: z.string().refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), 'Email inválido'),
  status: z.enum(['ATIVO', 'INATIVO']),
  tags: z.array(z.string()),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox';
  required: boolean;
  options?: string[];
  value?: any;
}

interface ClientFormProps {
  client?: Partial<ClientFormData>;
  onSubmit: (data: ClientFormData & { customFields: Record<string, any> }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ClientForm({ client, onSubmit, onCancel, isLoading }: ClientFormProps) {
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState<string[]>(client?.tags || []);

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      razaoSocial: client?.razaoSocial || '',
      nomeFantasia: client?.nomeFantasia || '',
      documento: client?.documento || '',
      inscricaoEstadual: client?.inscricaoEstadual || '',
      inscricaoMunicipal: client?.inscricaoMunicipal || '',
      tiposPessoa: client?.tiposPessoa || 'JURIDICA',
      regimeTributario: client?.regimeTributario || 'SIMPLES_NACIONAL',
      cep: client?.cep || '',
      logradouro: client?.logradouro || '',
      numero: client?.numero || '',
      complemento: client?.complemento || '',
      bairro: client?.bairro || '',
      cidade: client?.cidade || '',
      estado: client?.estado || '',
      telefone: client?.telefone || '',
      email: client?.email || '',
      status: client?.status || 'ATIVO',
      tags: client?.tags || [],
    },
  });

  // Buscar CEP
  const handleCepBlur = async (cep: string) => {
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          form.setValue('logradouro', data.logradouro);
          form.setValue('bairro', data.bairro);
          form.setValue('cidade', data.localidade);
          form.setValue('estado', data.uf);
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  // Adicionar tag
  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      const updatedTags = [...tags, newTag];
      setTags(updatedTags);
      form.setValue('tags', updatedTags);
      setNewTag('');
    }
  };

  // Remover tag
  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    form.setValue('tags', updatedTags);
  };

  // Adicionar campo customizado
  const addCustomField = () => {
    const newField: CustomField = {
      id: Date.now().toString(),
      label: 'Novo Campo',
      type: 'text',
      required: false,
    };
    setCustomFields([...customFields, newField]);
  };

  // Remover campo customizado
  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter(field => field.id !== id));
  };

  // Atualizar campo customizado
  const updateCustomField = (id: string, updates: Partial<CustomField>) => {
    setCustomFields(customFields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const handleSubmit = (data: ClientFormData) => {
    const customFieldsData = customFields.reduce((acc, field) => {
      acc[field.id] = field.value;
      return acc;
    }, {} as Record<string, any>);

    onSubmit({
      ...data,
      tags,
      customFields: customFieldsData,
    });
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
              <TabsTrigger value="address">Endereço</TabsTrigger>
              <TabsTrigger value="contact">Contato</TabsTrigger>
              <TabsTrigger value="custom">Campos Extras</TabsTrigger>
            </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>
                  Dados principais do cliente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="razaoSocial"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Razão Social *</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tiposPessoa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Pessoa *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="FISICA">Pessoa Física</SelectItem>
                            <SelectItem value="JURIDICA">Pessoa Jurídica</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="documento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CNPJ/CPF *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="00.000.000/0000-00" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="inscricaoEstadual"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inscrição Estadual</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="regimeTributario"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Regime Tributário *</FormLabel>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
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

                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Adicionar tag"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <Button type="button" onClick={addTag} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="address" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Endereço</CardTitle>
                <CardDescription>
                  Informações de localização do cliente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="cep"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              {...field} 
                              placeholder="00000-000"
                              onBlur={(e) => handleCepBlur(e.target.value.replace(/\D/g, ''))}
                            />
                            <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          </div>
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
                        <FormLabel>Estado *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="SP" maxLength={2} />
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
                        <FormLabel>Cidade *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="logradouro"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logradouro *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="numero"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número *</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                          <Input {...field} />
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
                        <FormLabel>Bairro *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações de Contato</CardTitle>
                <CardDescription>
                  Dados para comunicação com o cliente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="telefone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone *</FormLabel>
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
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="custom" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Campos Personalizados</CardTitle>
                    <CardDescription>
                      Adicione campos extras conforme necessário
                    </CardDescription>
                  </div>
                  <Button type="button" onClick={addCustomField} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Campo
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {customFields.map((field) => (
                  <div key={field.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <Input
                        value={field.label}
                        onChange={(e) => updateCustomField(field.id, { label: e.target.value })}
                        placeholder="Nome do campo"
                        className="max-w-xs"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCustomField(field.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      <Select
                        value={field.type}
                        onValueChange={(value: any) => updateCustomField(field.id, { type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Texto</SelectItem>
                          <SelectItem value="number">Número</SelectItem>
                          <SelectItem value="date">Data</SelectItem>
                          <SelectItem value="select">Seleção</SelectItem>
                          <SelectItem value="checkbox">Checkbox</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={field.required}
                          onCheckedChange={(checked) => updateCustomField(field.id, { required: checked })}
                        />
                        <Label>Obrigatório</Label>
                      </div>
                    </div>

                    {field.type === 'select' && (
                      <Textarea
                        placeholder="Opções (uma por linha)"
                        value={field.options?.join('\n') || ''}
                        onChange={(e) => updateCustomField(field.id, { 
                          options: e.target.value.split('\n').filter(Boolean) 
                        })}
                      />
                    )}

                    {/* Campo de valor */}
                    <div>
                      <Label>Valor</Label>
                      {field.type === 'text' && (
                        <Input
                          value={field.value || ''}
                          onChange={(e) => updateCustomField(field.id, { value: e.target.value })}
                        />
                      )}
                      {field.type === 'number' && (
                        <Input
                          type="number"
                          value={field.value || ''}
                          onChange={(e) => updateCustomField(field.id, { value: e.target.value })}
                        />
                      )}
                      {field.type === 'date' && (
                        <Input
                          type="date"
                          value={field.value || ''}
                          onChange={(e) => updateCustomField(field.id, { value: e.target.value })}
                        />
                      )}
                      {field.type === 'select' && field.options && (
                        <Select
                          value={field.value || ''}
                          onValueChange={(value) => updateCustomField(field.id, { value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {field.type === 'checkbox' && (
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={field.value || false}
                            onCheckedChange={(checked) => updateCustomField(field.id, { value: checked })}
                          />
                          <Label>Ativado</Label>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {customFields.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum campo personalizado adicionado
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4 pt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : client ? 'Atualizar' : 'Criar'} Cliente
          </Button>
        </div>
        </form>
      </Form>
    </div>
  );
}
