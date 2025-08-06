'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useMutation } from '@/hooks/useApi';

const userSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email deve ter um formato válido'),
  password: z.string().optional(),
  role: z.enum(['ADMIN', 'CONTADOR', 'ASSISTENTE'], {
    required_error: 'Papel é obrigatório',
  }),
  active: z.boolean().default(true),
});

type UserFormData = z.infer<typeof userSchema>;

interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'CONTADOR' | 'ASSISTENTE';
  active: boolean;
}

interface UserFormProps {
  user?: User;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function UserForm({ user, onSuccess, onError }: UserFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isEditing = !!user;

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      password: '',
      role: user?.role || 'CONTADOR',
      active: user?.active ?? true,
    },
  });

  const { mutate: createUser, loading: creating } = useMutation<User, UserFormData>(
    (data) => fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    }).then(res => {
      if (!res.ok) {
        return res.json().then(err => {
          throw new Error(err.message || 'Erro ao criar usuário');
        });
      }
      return res.json();
    })
  );

  const { mutate: updateUser, loading: updating } = useMutation<User, { id: number; data: Partial<UserFormData> }>(
    ({ id, data }) => fetch(`/api/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    }).then(res => {
      if (!res.ok) {
        return res.json().then(err => {
          throw new Error(err.message || 'Erro ao atualizar usuário');
        });
      }
      return res.json();
    })
  );

  const onSubmit = async (data: UserFormData) => {
    try {
      if (isEditing && user) {
        // Para edição, remover password se estiver vazio
        const updateData = { ...data };
        if (!updateData.password) {
          delete updateData.password;
        }
        
        const result = await updateUser({ id: user.id, data: updateData });
        if (result) {
          onSuccess();
        }
      } else {
        // Para criação, password é obrigatório
        if (!data.password) {
          form.setError('password', { message: 'Senha é obrigatória para novos usuários' });
          return;
        }
        
        const result = await createUser(data);
        if (result) {
          onSuccess();
        }
      }
    } catch (error: any) {
      onError(error.message);
    }
  };

  const loading = creating || updating;

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
        </CardTitle>
        <CardDescription>
          {isEditing 
            ? 'Atualize as informações do usuário abaixo.'
            : 'Preencha as informações para criar um novo usuário.'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o nome completo"
                        {...field}
                        disabled={loading}
                      />
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
                      <Input
                        type="email"
                        placeholder="Digite o email"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {isEditing ? 'Nova Senha (opcional)' : 'Senha'}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder={isEditing ? 'Deixe em branco para manter a atual' : 'Digite a senha'}
                          {...field}
                          disabled={loading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={loading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Papel</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o papel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ADMIN">Administrador</SelectItem>
                        <SelectItem value="CONTADOR">Contador</SelectItem>
                        <SelectItem value="ASSISTENTE">Assistente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {isEditing && (
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Usuário Ativo
                      </FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Usuários inativos não podem fazer login no sistema
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={loading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <div className="flex items-center gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 sm:flex-none"
              >
                {loading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    {isEditing ? 'Atualizando...' : 'Criando...'}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditing ? 'Atualizar' : 'Criar'} Usuário
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
                disabled={loading}
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
