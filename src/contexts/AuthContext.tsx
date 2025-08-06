'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authApi, LoginRequest, RegisterRequest } from '@/lib/api';

// Tipos
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'ADMIN' | 'CONTADOR' | 'ASSISTENTE';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

// Criar o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider do contexto
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Função para extrair token do cookie
  const getTokenFromCookie = () => {
    if (typeof document === 'undefined') return null;

    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  };

  // Verificar se há token salvo no localStorage ou cookies
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        let savedToken = localStorage.getItem('token');
        let savedUser = localStorage.getItem('user');

        // Se não há token no localStorage, verificar cookies
        if (!savedToken) {
          savedToken = getTokenFromCookie();
        }

        if (savedToken) {
          setToken(savedToken);

          // Se há token mas não há user no localStorage, tentar decodificar do token
          if (!savedUser && savedToken) {
            try {
              // Decodificar JWT para extrair informações básicas
              const payload = JSON.parse(atob(savedToken.split('.')[1]));
              const userData = {
                id: payload.sub,
                email: payload.email,
                name: payload.email.split('@')[0], // Nome temporário baseado no email
                role: payload.role
              };

              setUser(userData);

              // Salvar no localStorage para próximas sessões
              localStorage.setItem('token', savedToken);
              localStorage.setItem('user', JSON.stringify(userData));
            } catch (decodeError) {
              console.error('Erro ao decodificar token:', decodeError);
            }
          } else if (savedUser) {
            setUser(JSON.parse(savedUser));
          }

          // Temporariamente desabilitado para evitar loop
          // TODO: Reabilitar validação do token quando backend estiver estável
          // try {
          //   await authApi.validateToken();
          // } catch (error) {
          //   // Token inválido, limpar dados
          //   localStorage.removeItem('token');
          //   localStorage.removeItem('user');
          //   setToken(null);
          //   setUser(null);
          // }
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Função de login
  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      const response = await authApi.login(credentials);

      const { access_token, user: userData } = response;

      // Salvar no localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Salvar no cookie para o middleware
      document.cookie = `token=${access_token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;

      // Atualizar estado
      setToken(access_token);
      setUser(userData as User);
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Função de registro
  const register = async (data: RegisterRequest) => {
    try {
      setIsLoading(true);
      await authApi.register(data);
      
      // Após registro, fazer login automaticamente
      await login({ email: data.email, password: data.password });
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Remover cookie
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    setToken(null);
    setUser(null);
  };

  // Função para atualizar dados do usuário
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // Valor do contexto
  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Hook para verificar permissões
export const usePermissions = () => {
  const { user } = useAuth();

  const hasRole = (roles: string | string[]): boolean => {
    if (!user) return false;
    
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    return allowedRoles.includes(user.role);
  };

  const isAdmin = (): boolean => hasRole('ADMIN');
  const isContador = (): boolean => hasRole(['ADMIN', 'CONTADOR']);
  const isAssistente = (): boolean => hasRole(['ADMIN', 'CONTADOR', 'ASSISTENTE']);

  return {
    hasRole,
    isAdmin,
    isContador,
    isAssistente,
    userRole: user?.role,
  };
};
